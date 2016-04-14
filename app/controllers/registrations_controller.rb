class RegistrationsController < Devise::RegistrationsController

  before_filter :configure_permitted_parameters
  skip_before_action :verify_authenticity_token

  def new
    @user = User.new
    build_resource({})
    #respond_with self.resource
    redirect_to root_path
  end

  def edit
    auth_options = {  :scope => :user }
    resource = warden.authenticate!(auth_options) 
  end

  def update
    @user = current_user
    @user.update(user_params)
    if @user.save!
      flash[:notice] = "Your account was successfully updated!"
      redirect_to user_profile_path(@user)
      #redirect_to edit_user_profile_path(current_user)
    else  
      flash[:alert] = "Update canceled"
    end 
  end
  


  def create
   build_resource(sign_up_params)
   resource.save

   yield resource if block_given?
   if resource.persisted?
      if resource.active_for_authentication?
         set_flash_message :notice, :signed_up if is_flashing_format?
         sign_up(resource_name, resource)
         respond_with resource, location: after_sign_up_path_for(resource)
      else
         set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format?
         expire_data_after_sign_in!
         respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
      session[:auth_error] = nil
   else
      clean_up_passwords resource
      msg = resource.errors.full_messages.try(:first)
      session[:auth_error] = msg
      respond_to do |format|
        format.html { 
          get_top_data
          render template: "home/index" 
        }
        format.json { render json: {result: 'error', message: msg} }
      end
   end


protected

  def configure_permitted_parameters
    #logger.debug "-- devise sanitizer"
    allowed_params = [:first_name, :last_name, :email, :password, :date_of_birth, :country_id]
    devise_parameter_sanitizer.for(:sign_up) << allowed_params
    devise_parameter_sanitizer.for(:account_update) << allowed_params
  end

  

  private

 def user_params
    params.require(:user).permit(
      :first_name, :last_name, :avatar, :date_of_birth, :email,
    )
  end

end
