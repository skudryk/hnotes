#require 'will_paginate/array'


class PeopleController < ApplicationController

  skip_before_filter :authenticate, :only => :unsubscribe

  def index
    session[:people_sort_dir] = ['desc','asc'] if !session[:people_sort_dir]
    session[:people_sort_by] = params[:sort_by]
    psd =  session[:people_sort_dir]
    @sort_by = params[:sort_by] || 'master_id'
    if session[:people_sort_by] == params[:sort_by] # repeated click
      psd = psd.push(psd.shift) #cycle
    end
    @dir = psd[0]
    order_clause = "#{person_table(params[:people_category])}.#{@sort_by} #{@dir}"
    order_clause = "email_addresses.email #{@dir}" if @sort_by == 'email'
    @link = people_path
    options = {
      select: %w(master_id first_name last_name subscribed email_addresses.email),
      include: :email_addresses,
      conditions: search_conditions,
      order: order_clause
    }
    #options[:page] = params[:page] if params[:page]
    
    logger.debug "execute query, options: #{options}"
    if !params[:people_category]
      @people = people_scope.page(params[:page])   #paginate(options)
    else
      p = people_find(params[:people_category],options)
      #@people = p.paginate(:page => params[:page])  #paginate(options)
      #@people = p.page(params[:page])  #paginate(options)
      @people = Kaminari.paginate_array(p).page(params[:page])
      #logger.debug "## will_paginate people collection: #{@people.public_methods.sort}"
      #@people = p.page(params[:page])
      @category = params[:people_category]
    end
    
    if params[:commit]
      if @people.count > 0
        flash.now[:notice] = "Search results ( found #{@people.count} #{params[:people_category]}(s) )"
        #logger.debug "checking"
        #logger.debug "## #{@people.email_addresses.map(&:email)}"
      else
        flash.now[:error] = "Found nothing"
      end
    end

    respond_to do |format|
      format.html
      format.json { render json: @people }
    end
  end

  def show
    #logger.debug "## person_class: #{person_class.inspect}"
    #@person = people_scope.find_by_master_id(params[:id])
    @person = person_class.find_by_master_id(params[:id]) # ignore scope for now
    logger.debug "## person #{@person.inspect}"
    unless @person
      flash[:error] = "#{current_category} is not found"
      return redirect_to action: :index
    end
    @chart = person_chart(@person)
    respond_to do |format|
      format.html
      format.json { render json: @doctor }
    end
  end

  def autocomplete
    property = params[:property]
    if Segment::STATISTICS_PROPERTY_NAMES.include? property
      model_name = Campaign
      property = 'name'
    else
      model_name = person_class
    end
    values = model_name.all({
      select: property,
      group: property,
      conditions: ["#{property} LIKE ?", "#{params[:term]}%"],
      limit: 10
    }).map { |p| p.send property }
    render json: values
  end

  def search
    @person = person_class.new
  end

  def subscribe
    change_subscription(true, 'subscribed')
  end

  def unsubscribe
    change_subscription(false, 'unsubscribed')
  end

  def change_subscription(status, action_text)
    #@email = EmailAddress.find_by_email(params[:email])
    if @email.nil?
      flash.now[:error] = "Email address not found"
    else
      @person = @email.get_person #person_class.find_by_healthtap_id(@email.healthtap_id)
      if @person
        logger.debug @person.healthtap_id
        @person.subscribed = status
        @person.save
        flash.now[:notice] = "#{@person.first_name} #{@person.last_name} has been successfully #{action_text}."
      else
         flash.now[:error] = "Person not found"
      end
    end
    respond_to do |format|
      format.html {
       if current_user
         render :template => 'people/subscribe'
         return
       else
        render :template => 'people/subscribe', :layout => "public"
        return
       end
       }
      format.json { render json: { result: 'success', message: flash.now[:error] || flash.now[:notice] } }
    end
  end


  def upload
  end

  # import CSV data (emails) from uploaded file and unsubscribe people
  def import
    input = params[:file_form][:uploaded_data].instance_variable_get(:@tempfile)

    emails = input.read.split("\n").map { |s| s.strip.split(';')[0] }
    logger.debug "## initial content, entries count: #{emails.length}"
    emails = emails.compact.delete_if {|e| !e.include? '@'}.map{|e| (e) ? e.to_s.gsub(/[^\w\.\-\@\+\']+/,'') : ''}

    #ea = EmailAddress.where('email IN ("' + emails.join('","') + '")')
    logger.debug "## found #{ea.count} email addresses"
    ea.each do |e|
      p = e.get_person # according to tool current category
      p.update_attributes({:subscribed => false}) if p
    end

    unsubscribed_count = ea.count #people_to_unsubscribe.count  #Person.unsubscribe(emails)
    if unsubscribed_count > 0
      res = 'success'
      message = "Success. Number of unsubscribed: #{unsubscribed_count}"
    else
      res = 'failure'
      message = "Failed to read data from uploaded file"
    end
    respond_to do |format|
       format.json { render :json => {:result => res, :message => message} }
    end
  end


  private

  def person_class(cat=nil)
    { 'user' => User, 'admin' => Admin, 'guest' => Visitor}[cat || current_category]
  end

  def people_scope(cat=nil,options={})
    person_class(cat).by_hid #.order("#{person_class.table_name}.master_id desc")
  end


  def people_find(cat,options)
    logger.debug "## #{options[:conditions]}"
    options[:conditions][0] += " AND #{person_class(cat).by_hid_str}"
    person_class(cat).find(:all, options)
  end
  
  def person_table(cat=nil)
    pc = person_class(cat)
    pt = pc.to_s.downcase.pluralize
    pt
  end
  
  def search_conditions
    return unless params[:commit]
    conditions = []
    condition_params = []
    logger.debug "## person_class: #{person_class.to_s.downcase}"
    params[params[:people_category] || person_class.to_s.downcase].each do |k,v|
      unless v.blank?
        conditions << "#{k} LIKE ?"
        condition_params << "%#{v}%"
      end
    end
    unless params[:email].blank?
      conditions << "email_addresses.email LIKE ?"
      condition_params << "%#{params[:email]}%"
    end
    #conditions << "experts.healthtap_id > 10000001" if params[:category] == 'member'
    [conditions.join(' AND ')] + condition_params unless conditions.blank?
  end


end
