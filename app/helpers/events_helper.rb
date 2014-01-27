module EventsHelper

  def find_location(term)
    places = Place.all
    max_score = 0
    max_place = nil
    return {:p => nil, :score => nil} if term.nil?
    Abbreviation.all.each do |a|
      term.gsub!(a.orig_term, a.new_term)
    end
    places.each {|p|
      name = p.name
      return {:p => p, :score => -1} if name.downcase == term.downcase
      return {:p => p, :score => -2} if term.downcase.include?(name.downcase)
      score = 0
      words = name.split(" ")
      words.each {|w|
        score += 1 if term.include?(w.downcase)
      }
      if score >= max_score and score != 0
        max_score = score
        max_place = p
      end
    }
    return {:p => max_place, :score => max_score}


  end
  def process_date(date)
    date = date.split(", ")
    time = date[3]
    time = time.split("&nbsp;&ndash;&nbsp;")
    s_is_pm = false
    s_is_am = false
    start_h = time[0].split(":")[0]
    start_m =  !time[0].split(":")[1].nil? ? time[0].split(":")[1] : "00"
    start_h = (start_h.to_i + 12).to_s if time[0].include?("pm")
    if time[0].include?("pm")
      s_is_pm = true
    elsif time[0].include?("am")
      s_is_am = true
    end
    start_h.gsub!(/[ap]{1}m/,"")
    start_m.gsub!(/[ap]{1}m/,"")
    unless time[1].nil?
      end_h = time[1].split(":")[0]
      end_m =  !time[1].split(":")[1].nil? ? time[1].split(":")[1] : "00"
      if time[1].include?("pm")
        unless (s_is_am or s_is_pm) or (start_h.to_i > end_h.to_i)
          start_h = (start_h.to_i + 12).to_s
        end
        end_h = (end_h.to_i + 12).to_s
      end
      end_h.gsub!(/[ap]{1}m/,"")
      end_m.gsub!(/[ap]{1}m/,"")
    end
    startstring = "#{date[1]} #{date[2]} #{start_h} #{start_m} EST"
    s_time = DateTime.strptime(startstring, "%B %e %Y %k %M %Z")
    endstring = "#{date[1]} #{date[2]} #{end_h} #{end_m} EST"
    e_time = DateTime.strptime(endstring, "%B %e %Y %k %M %Z") unless time[1].nil?
    {:start => s_time, :end => e_time}
    # date
  end

end
