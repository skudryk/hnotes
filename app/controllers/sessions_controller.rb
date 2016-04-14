class SessionsController < Devise::SessionsController
  # respond_to :html, :json
  # skip_before_action :verify_authenticity_token
  
  def new
    @user = User.new
    redirect_to root_path  # in case of login failure (easy way)
  end

  def create
    msg = t(:not_saved, scope: [:devise, :failure, :not_saved])
    session[:auth_error] = msg unless User.find_by_email(params[:email]).try(:valid_password?, params[:password])
    self.resource = warden.authenticate!(auth_options)
    #set_flash_message(:notice, :signed_in) if is_navigational_format?
    # sign_in(resource_name, resource)
    sign_in_and_redirect resource
    if current_user
      flash[:notice] = "Welcome back!"
      session[:auth_error] = nil
    else  
      flash[:alert] = msg
      session[:auth_error] = msg
    end
  end


end
