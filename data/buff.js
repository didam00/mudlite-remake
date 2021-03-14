data.buff = [
  {
    id: '갑옷 파괴',
    des: '방어력이 50% 감소합니다.',
    stat: {
      def: '-50%',
    },
    tag: ['debuff']
  },
  {
    id: '진짜 시력 저하',
    des: '화면이 블러처리됩니다... 이것도 못읽겠지?',
    tag: ['debuff']
  },
  {
    id: '시력 저하',
    des: '치명타 확률이 40% 감소됩니다.',
    stat: {
      critical: '-40%',
    },
    tag: ['debuff']
  },
  {
    id: '울렁증',
    des: '화면이 돌아갑니다.',
    tag: ['debuff']
  },
  {
    id: '처형자',
    des: '공격력이 5% 증가합니다.',
    stat: {
      attack: '5%',
    },
    tag: ['buff']
  },
  {
    id: '무기 혼란',
    des: '잦은 무기 변경으로 인해 공격 스탯이 대폭 감소됩니다.',
    stat: {
      attack: '-20%',
      spell: '-20%',
      attack_speed: '-20%',
      critical: '-66%',
    },
    tag: ['debuff']
  },
  {
    id: '대까!',
    des: '대부분의 능력치가 소폭 감소합니다.',
    stat: {
      def: '-8%',
      reg: '-8%',
      spell: '-8%',
      attack_speed: '-8%',
      block: '-8%',
      health_regen: '-8%',
      mana_regen: '-8%',
    },
    tag: ['debuff']
  },
  {
    id: '단단한 방패',
    des: '고정피해를 제외한 모든 피해를 무시합니다.',
    stat: {
      def: 9999,
      reg: 9999,
    },
    tag: ['buff']
  },
  {
    id: '신경 파괴 대기 중',
    des: '-',
    tag: ['cool']
  },
  {
    id: '무감각',
    des: '당신의 체력을 확인할 수 없습니다.',
    tag: ['debuff']
  },
  {
    id: '압도',
    des: '대부분의 능력치가 소폭 감소합니다.',
    stat: {
      def: '-8%',
      reg: '-8%',
      spell: '-8%',
      speed: '-8%',
      attack_speed: '-8%',
      block: '-8%',
      health_regen: '-8%',
      mana_regen: '-8%',
    },
    tag: ['debuff']
  },
  {
    id: '재생',
    des: '체력 재생이 100% 증가합니다.',
    stat: {
      health_regen: '100%',
    },
    tag: ['buff']
  },
  {
    id: '마나 재생',
    des: '마나 재생이 100% 증가합니다.',
    stat: {
      mana_regen: '100%',
    },
    tag: ['buff']
  },
  {
    id: '특수 재생',
    des: '체력 재생과 마나 재생이 999% 증가합니다.',
    stat: {
      health_regen: '999%',
      mana_regen: '999%',
    },
    tag: ['buff']
  },
  {
    id: '핏빛 카타나 대기 중',
    des: '핏빛 카타나의 효과가 대기 중입니다.',
    tag: ['cool']
  },
  {
    id: '자연 치유',
    des: '체력 재생 5 증가합니다.',
    stat: {
      health_regen: 4,
    },
    tag: ['buff']
  },
  {
    id: '느린 자연 치유',
    des: '체력 재생 2 증가합니다.',
    stat: {
      health_regen: 2,
    },
    tag: ['buff']
  },
  {
    id: '깊은 상처',
    des: '체력 회복 능력이 50% 감소합니다.',
    tag: ['debuff']
  },
  {
    id: '출혈 I',
    des: '매 턴 3의 피해를 입습니다.',
    func(who) {
      who.health -= 2
    },
    tag: ['debuff']
  },
  {
    id: '출혈 II',
    des: '매 턴 6의 피해를 입습니다.',
    func(who) {
      who.health -= 4
    },
    tag: ['debuff']
  },
  {
    id: '출혈 III',
    des: '매 턴 9의 피해를 입습니다.',
    func(who) {
      who.health -= 6
    },
    tag: ['debuff']
  },
  {
    id: '불타는 중',
    des: '매 턴 3의 피해를 입습니다.',
    func(who) {
      who.health -= 3
    },
    tag: ['debuff']
  },
  {
    id: '영리함',
    des: '주문력이 10 증가합니다',
    stat: {
      spell: 10,
    },
    tag: ['buff']
  },
  {
    id: '난폭함',
    des: '공격력이 40% 증가합니다. 대신 방어력이 25% 감소합니다.',
    stat: {
      attack: '40%',
      def: '-25%',
    },
    tag: ['buff']
  },
  {
    id: '무기력',
    des: '마나를 사용하지 못합니다.',
    func(who) {
      who.mana = 0
    },
    tag: ['debuff']
  },
  {
    id: '아이템의 저주',
    des: '드롭되는 아이템의 얻는 량의 확률이 감소합니다.',
    tag: ['debuff']
  },
  {
    id: '흡혈귀',
    des: '흡혈이 100% 증가합니다.',
    stat: {
      vampire: '100%',
    },
    tag: ['buff']
  },
  {
    id: '재빠른 칼날 대기 중',
    des: '재빠른 칼날 대기 중입니다.',
    tag: ['cool']
  },
  {
    id: '재빠른 움직임',
    des: '속도가 200% 증가합니다',
    stat: {
      speed: '200%',
    },
    tag: ['buff']
  },
  {
    id: '재빠른 칼날!',
    des: '공격속도가 110% 증가합니다.',
    stat: {
      attack_speed: '110%',
    },
    tag: ['buff']
  },
]