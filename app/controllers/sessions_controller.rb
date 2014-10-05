class SessionsController < ApplicationController

  skip_before_filter :authenticate, :only => [:new, :create]

  def new
  end

  def create
    user = User.authenticate(params[:email], params[:password])
    if user && user.status == 'enabled'
      session[:user_id] = user.id
      redirect_to root_url
    else
      if user
        flash.now.alert = 'Account is not approved'
      else
        flash.now.alert = 'Invalid name or password'
      end
      render 'new'
    end
  end

  def remote_auth
    user = User.authenticate(params[:email], params[:password])
    session[:user_id] = user.id if user
    respond_to do |format|
      format.json { render :json => {:result => (user) ? 'success' : 'failure'} }
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

end
