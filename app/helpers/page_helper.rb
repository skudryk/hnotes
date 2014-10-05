module PageHelper
    
   def parent_list_for_selection
     fn = @page.suggested_parent_list[0]
     options_for_select(@page.suggested_parent_list.map {|e| [e.title,"#{e.class.to_s}:#{e.id}"]}, "#{fn.class.to_s}:#{fn.id}")
   end
   
end
