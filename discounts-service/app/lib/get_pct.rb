# Get discount percentage based on infos
class GetPct
  def self.by_birth_date(birth_date)
    now = Time.now
    birth_date = Time.at(birth_date.to_i / 1000).utc
    if birth_date.day == 29 and birth_date.month == 02
      0 # No discount for February 29
    elsif (birth_date.day == now.day) && (birth_date.month == now.month)
      0.5 # 50% discount for his birthday
    elsif birth_date.month == now.month
      0.2 # 20% discount for his month birthday
    else
      0.1 # 10% discount anyways
    end
  end
end
