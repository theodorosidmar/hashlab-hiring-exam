require 'date'
require_relative '../../app/lib/get_pct'

RSpec.describe GetPct, type: :class do
  describe '.by_birth_date' do
    context 'when birth_date is February 29' do
      pct = described_class.by_birth_date(Time.new(2016, 2, 29).to_i * 1000)
      it { expect(pct).to eq(0) }
    end
    context 'when it is his birthday' do
      pct = described_class.by_birth_date(Time.now.to_i * 1000)
      it { expect(pct).to eq(0.5) }
    end
    context 'when it his month birthday' do
      pct = described_class.by_birth_date((Time.now - 86400).to_i * 1000)
      it { expect(pct).to eq(0.2) }
    end
    context 'when no rules are match' do
      pct = described_class.by_birth_date(Time.now)
      it { expect(pct).to eq(0.1)  }
    end
  end
end
