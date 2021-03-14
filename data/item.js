data.item = [
  {
    id: '부서진 뼈',
    des: '이후 50개를 모아 해골 인형 제작에 쓰인다.',
    tag: [],
  },
  {
    id: '해골 인형',
    des: '이 영혼이 담긴 인형은 언제든 깨어날 수 있습니다.',
    tag: [],
  },
  {
    id: '엑스칼리본',
    des: '뼈로 만든 흔한 전설의 검.',
    tag: ['weapon'],
    stat: {
      attack: 8,
      attack_speed: 0.1,
    },
    durability: 1,
    firmness: 0,
  },
  {
    id: '분노 망치',
    des: '영구적으로 무감각하고 방어력이 25% 감소하는대신 공격력이 40% 증가합니다.',
    tag: ['weapon'],
    stat: {
      attack: 12,
    },
    func(who) {
      getbuff('무감각', 1, who)
      getbuff('난폭함', 1, who)
    },
    durability: 1,
    firmness: 0,
  },
  {
    id: '두개골 석궁',
    des: '치명타 데미지가 20% 증가합니다.',
    tag: ['weapon'],
    stat: {
      attack: 4,
      attack_speed: 0.2,
      critical: 0.1,
      critical_damage: 0.2,
    },
    durability: 1,
    firmness: 0,
  },
  {
    id: '두개골 방패',
    des: '-',
    tag: ['weapon'],
    stat: {
      speed: 4,
      critical: 0.1,
      def: 2,
    },
    durability: 40,
    firmness: 0.3,
  },
  {
    id: '두개골 귀걸이',
    des: '치명타 적중 시 속도가 대폭 상승합니다.',
    tag: ['weapon', 'acc'],
    stat: {
      speed: 1,
      critical: 0.01,
    },
    when_attack(who, to) {
      if(info.critical && (!make_list(who.buff).includes('재빠른 움직임'))) {
        getbuff('재빠른 움직임', 1, who)
        enter('속도가 상승했다. #두개골_귀걸이')
      }
      return 0;
    },
    durability: 1,
    firmness: 0,
  },
  {
    id: '마법 단검',
    des: '공격할 때 8 + 주문력X0.4 + (강화X2.5) 만큼의 마법피해를 줍니다.',
    tag: ['weapon'],
    stat: {
      attack_speed: 0.3,
      spell: 18,
    },
    when_attack(who, to) {
      var howdeal = deal(8 + getstat('spell', who)*0.4 + this.upgrade*2.5, to, who, 'spell')
      return howdeal;
    },
    durability: 10,
    firmness: 0,
  },
  {
    id: '송곳니방패',
    des: '뼈로 만든 흔한 전설의 검.',
    tag: ['weapon'],
    stat: {
      attack: 8,
      attack_speed: 0.1,
    },
    durability: 1,
    firmness: 0,
  },
  {
    id: '재생의 방패',
    des: '전투 중이 아닐때 체력 재생이 두배 증가합니다.',
    tag: ['weapon'],
    stat: {
      health: 30,
      health_regen: 1,
    },
    func(who, to) {
      if(enemy != null) {
        if(enemy.health <= 0) {
          getbuff('재생', 1, who)
        }
      }
    },
    durability: 40,
    firmness: 0.2,
  },
  {
    id: '재생의 목걸이',
    des: '전투 중이 아닐때 체력 재생이 두배 증가합니다.',
    tag: ['weapon', 'acc'],
    stat: {
      health: 30,
      health_regen: 1,
    },
    func(who, to) {
      if(enemy != null) {
        if(enemy.health <= 0) {
          getbuff('재생', 1)
        }
      }
    },
    durability: 40,
    firmness: 0.2,
  },
  {
    id: '충전의 마법반지',
    des: '매 턴 반지의 주문력이 상승합니다. 주문을 시전하면 주문력이 초기화됩니다. (최대 72+강화X6)',
    tag: ['weapon', 'acc'],
    stat: {
      spell: 0,
      mana_regen: 0.6,
    },
    when_skill(who, to) {
      setstat('spell', -this.stat.spell, who)
      this.stat.spell = 0;
      return 0;
    },
    func(who, to) {
      if(this.stat.spell < 72+(this.upgrade*6)) {
        this.stat.spell += 3;
        setstat('spell', 3, who);
      }
    },
    durability: 40,
    firmness: 0.2,
  },
  {
    id: '인내의 마법반지',
    des: '주문을 시전하면 주문력이 0.5+(강화X0.04) 상승합니다.',
    tag: ['weapon', 'acc'],
    stat: {
      spell: 0,
      mana_regen: 0.6,
    },
    when_skill(who, to) {
      this.stat.spell += 0.5 + this.upgrade*0.03;
      return 0;
    },
    durability: 40,
    firmness: 0.2,
  },
  {
    id: '상어이빨창',
    des: '공격할 때 상대 잃은 체력의 6+(강화X0.45)% 피해를 추가로 입힙니다.',
    tag: ['weapon'],
    stat: {
      ignore_def: 4,
      attack: 3,
    },
    when_attack (who, to) {
      var damage = deal((getstat('health', to) - to.health) * 0.06 + this.upgrade*0.45, to, who);
      return damage;
    },
    durability: 40,
    firmness: 0.2,
  },
  {
    id: '단단한 돌방패',
    des: '방어 성공 시 물리피해를 8+(강화) 줍니다.',
    tag: ['weapon'],
    stat: {
      def: 3,
      health: 20,
      block: 12,
      health_regen: 1,
    },
    when_block (who, to) {
      var damage = deal(8+this.upgrade, to, who);
      enter('방패를 사용해 '+to.id+'에게 '+damage+'만큼의 피해를 주었다.')
      return damage;
    },
    durability: 40,
    firmness: 0.2,
  },
  {
    id: '대가의 칼',
    des: '발음은 대까로 한다.',
    tag: ['weapon'],
    stat: {
      attack: 6,
    },
    when_attack(who, to) {
      getbuff('대까!', 3, who)
      return 0;
    },
    durability: 1,
    firmness: 0,
  },
  {
    id: '재빠른 칼날',
    des: '18-(강화X0.3)턴마다 공격할 때 3턴동안 공격속도가 110% 증가합니다.',
    tag: ['weapon'],
    stat: {
      attack: -3,
      attack_speed: 0.35,
    },
    func() {
      if(!make_list(me.buff).includes('재빠른 칼날 대기 중')) {
        if(enemy != null) {
          if(enemy.health > 0) {
            getbuff('재빠른 칼날 대기 중', Math.floor(18 - this.upgrade*0.3))
            getbuff('재빠른 칼날!', 3)
          }
        }
      }
      return 0;
    },
    durability: 1,
    firmness: 0,
  },
  {
    id: '부러진 검',
    des: '공격시 50% 확률로 5(+강화X0.8)의 고정피해를 추가로 줍니다.',
    tag: ['weapon'],
    stat: {
      attack: 5,
    },
    when_attack(who, to) {
      if(Math.random() < 0.5) {
        to.health -= 5+this.upgrade*0.8;
        return 5;
      } else {
        return 0;
      }
    },
    durability: 1,
    firmness: 0,
  },
  {
    id: '딱정벌레 마스크',
    des: '방어 성공 시 방어력X0.6(+강화X0.05)만큼의 물리 피해를 줍니다.',
    tag: ['weapon'],
    stat: {
      def: 12,
      block: 20,
    },
    when_block(who, to) {
      var dmg = deal(getstat('def', who)*(0.6+this.upgrade*0.05), to, who)
      enter('방어를 성공하고 '+dmg+'만큼의 피해를 주었다. 상대의 체력은 '+to.health+'만큼 남았다.')
      return dmg;
    },
    durability: 40,
    firmness: 0.5,
  },
  {
    id: '최후의 상어 목걸이',
    des: '체력이 20% 이하일 때 물리관통력이 100%+(강화X8%) 상승합니다.',
    tag: ['weapon', 'acc'],
    stat: {
      ignore_def: 1,
      attack: 1,
    },
    func(who, to) {
      if(who.health <= getstat('health', who)*0.2) {
        getstat('ignore_def', who, toString(100 + this.upgrade*0.08)+'%', true)
      }
    },
    durability: 40,
    firmness: 0.5,
  },
  {
    id: '금빛 방패',
    des: '방어 성공 시 체력을 7+(강화) 회복한다,',
    tag: ['weapon'],
    stat: {
      def: 9,
      health_regen: 1,
      block: 6,
    },
    when_block(who, to) {
      heal(7+this.upgrade, who)
      enter('방어 성공으로 체력을 회복했다. #금빛_방패')
      return 0;
    },
    durability: 20,
    firmness: 0.2,
  },
  {
    id: '출혈 도끼',
    des: '약해보이지만 약한 흡혈 무기.',
    tag: ['weapon'],
    stat: {
      def: 2,
      attack: 8,
      vampire: 0.1,
    },
    durability: 10,
    firmness: 0.1,
  },
  {
    id: '흡혈의 닻',
    des: '체력이 50% 이하로 내려가면 흡혈이 100% 증가합니다.',
    tag: ['weapon'],
    stat: {
      attack: 4,
      vampire: 0.2,
    },
    func(who, to) {
      if(me.health <= getstat('health', who)/2) {
        getbuff('흡혈귀', 1)
      }
    },
    durability: 3,
    firmness: 0.8,
  },
  {
    id: '독수리 목걸이',
    des: '공격할 때마다 3+(강화X0.2)의 추가 고정피해를 줍니다.',
    tag: ['weapon', 'acc'],
    stat: {
      attack: 1,
      attack_speed: 0.2,
    },
    when_attack(who, to) {
      to.health -= 3+this.upgrade*0.2;
      return 3+this.upgrade*0.2;
    },
    durability: 1,
    firmness: 0.1,
  },
  {
    id: '방어용 도끼',
    des: '이런걸 왜 방패로 쓰는거지?',
    tag: ['weapon'],
    stat: {
      attack: 2,
      def: Math.pow(2, 2),  
    },
    durability: 22,
    firmness: 0.2,
  },
  {
    id: '축복의 목걸이',
    des: '버프의 지속시간이 25% 증가합니다.',
    tag: ['weapon', 'acc'],
    stat: {
      buff_eff: 0.25
    },
    durability: 1,
    firmness: 0.2,
  },
  {
    id: '반저주 목걸이',
    des: '디버프의 지속시간이 25% 감소합니다.',
    tag: ['weapon', 'acc'],
    stat: {
      debuff_eff: -0.25
    },
    durability: 1,
    firmness: 0.2,
  },
  {
    id: '영혼 조각',
    des: '영혼압축대를 통해 영혼을 제작할 수 있다.',
    tag: [],
  },
  {
    id: '영혼',
    des: '이후 영혼 6개와 인형을 합쳐 저주를 제거하는 인형 제작에 쓰인다.',
    tag: [],
  },
  {
    id: '아무것도 없음',
    des: '이 설명은 왜 궁금한거야?',
    stat: {},
    tag: [],
  },
  {
    id: '민트초코바',
    des: '일부 유저들은 호불호에 의해 사용하지 못한다.',
    stat: {
      attack: 7,
      luck: 2,
      spell: 5,
    },
    tag: ['weapon'],
    durability: 10,
    firmness: 0.1,
  },
  {
    id: '거대한 도끼',
    des: '이걸론 아무데나 때려도 치명타겠다!',
    stat: {
      attack: -2,
      critical: 0.2,
    },
    tag: ['weapon'],
    durability: 10,
    firmness: 0.3,
  },
  {
    id: '초심자의 마법서',
    des: '주문이 10+(강화X0.7)의 추가 마법피해를 줍니다. 이 효과는 중첩되지 않습니다.',
    stat: {
      spell: 15,
      mana_regen: 2,
      mana: 25,
    },
    tag: ['weapon', 'magic'],
    durability: 10,
    firmness: 0.1,
  },
  {
    id: '핏빛 카타나',
    des: '4턴에 한 번씩 2턴간 출혈과 깊은 상처를 일으키고 4+(강화X0.3)의 추가 고정피해를 준다.',
    stat: {
      attack: 16,
      attack_speed: 0.4,
      critical: 0.2,
      vampire: 0.1,
    },
    when_attack(who, to) {
      if(!make_list(who.buff).includes('핏빛 카타나 대기 중')) {
        enter('핏빛 카타나의 효과로 '+enemy.id+'이 출혈과 깊은 상태가 발생됐다. #핏빛_카타나')
        getbuff('출혈', 2, to)
        getbuff('깊은 상처', 2, to)
        getbuff('핏빛 카타나 대기 중', 4, who)
        to.health -= 4 + this.upgrade*0.3
        return 4;
      } else {
        return 0;
      }
    },
    tag: ['weapon'],
    durability: 40,
    firmness: 0.4,
  },
  {
    id: '물리지팡이',
    des: '주문 (물리)',
    stat: {
      spell: -10,
      attack: 15,
    },
    tag: ['weapon'],
    durability: 5,
    firmness: 0.1,
  },
  {
    id: '검붉은철퇴',
    des: '철퇴에 이런게 왜 붙냐고요?',
    stat: {
      spell: 7,
      attack: 7,
      health_regen: 1.2,
      mana_regen: 1.2,
      def: 6,
      reg: 3,
      health: 20,
      mana: 20,
      karma: -2,
      learning_ability: 0.1,
    },
    tag: ['weapon'],
    durability: 2,
    firmness: 0,
  },
  {
    id: '매우 평범한 지팡이',
    des: '이후 평범한 지팡이로 강화시킬 수 있다.',
    stat: {
      spell: 12,
      mana_regen: 1,
      mana: 10,
    },
    tag: ['weapon'],
    durability: 1,
    firmness: 0,
  },
  {
    id: '평범한 지팡이',
    des: '이후 괜찮은 지팡이로 강화시킬 수 있다.',
    stat: {
      spell: 25,
      mana_regen: 2,
      mana: 30,
    },
    tag: ['weapon'],
    durability: 1,
    firmness: 0,
  },
  {
    id: '괜찮은 지팡이',
    des: '이후 최후의 지팡이로 강화시킬 수 있다.',
    stat: {
      spell: 50,
      mana_regen: 3,
      mana: 60,
    },
    tag: ['weapon'],
    durability: 1,
    firmness: 0,
  },
  {
    id: '최후의 지팡이',
    des: '이후 멸망의 지팡이로 강화시킬 수 있다.',
    stat: {
      spell: 120,
      mana_regen: 5,
      mana: 140,
    },
    tag: ['weapon'],
    durability: 1,
    firmness: 0,
  },
  {
    id: '철 상자 열쇠',
    des: '철 상자를 열때 사용할 수 있다.',
    tag: [],
  },
  {
    id: '소형 체력 물약',
    des: '체력을 20 회복시켜준다.',
    tag: ['potion'],
    func(who) {
      heal(20, who)
    },
  },
  {
    id: '소형 마나 물약',
    des: '마나를 20 회복시켜준다.',
    tag: ['potion'],
    func(who) {
      manaheal(20, who)
    },
  },
  {
    id: '기본 체력 물약',
    des: '체력을 50 회복시켜준다.',
    tag: ['potion'],
    func(who) {
      heal(50, who)
    },
  },
  {
    id: '닷지 주문서',
    des: '상황에서 벗어납니다.',
    tag: ['paper'],
    func(who) {
      game.situation = gettag(game.place)[0].id;
      enter('-')
      tock()
    },
  },
  // {
  //   id: '<흡혈> 마법책',
  //   des: '마법 <흡혈>을 배웁니다.',
  //   tag: ['book'],
  //   func(who) {
  //     me.skill = getdata(data.skill, '흡혈')
  //     enter('새로운 마법을 배운 기운이 맴돈다.')
  //   },
  // },
  {
    id: '지하 열쇠',
    des: '어딘가로 갈때 사용될 것 같다.',
    tag: ['key'],
  },
  {
    id: '금',
    des: '어딘가엔 사용되겠지.',
    tag: [],
  },
  {
    id: '아드레날린 물약',
    des: '순간적으로 모든 마나를 소비하고 소비한만큼 잠시동안 공격력과 주문력을 얻습니다. <br />잃은 체력에 따라 효율이 증가합니다.',
    tag: ['potion'],
    func(who) {
      $('html').css('transition', 'all 0ms')
      $('html').css('filter', 'invert()')
      setTimeout(function () {
        $('html').css('transition', 'all 2000ms')
        $('html').css('filter', 'none')
      },100)
      setstat('attack', 50+who.mana*(1 + who.health/getstat('health', who)), who, true);
      setstat('spell', 50+who.mana*(1 + who.health/getstat('health', who)), who, true);
      enter('힘이 치솟는다.')
      who.mana = 0;
    },
  },
  {
    id: '철의 물약',
    des: '순간적으로 방어력이 8 증가합니다. 방어력이 32 이하일 때만 사용가능합니다.',
    tag: ['potion'],
    func(who) {
      if(getstat('def', who) <= 32) {
        setstat('def', 8, who, true);
        enter('방어력이 강해졌음을 느꼈다.')
      }
    },
  },
  {
    id: '아편',
    des: '마나 재생과 체력 재ㅐㅅㅇ이 ㅡㅇㅈ가ㅏㅎㅂㅂ니ㄷ.',
    tag: ['potion'],
    func(who) {
      $('html').css('transition', 'all 0ms')
      $('html').css('filter', 'invert()')
      setTimeout(function () {
        $('html').css('transition', 'all 2000ms')
        $('html').css('filter', 'none')
      },100)
      getbuff('특수 재생', 6, who)
      getbuff('난폭함', 6, who)
      getbuff('진짜 시력 저하', 4, who)
      getbuff('울렁증', 12, who)
      getbuff('무감각', 12, who)
    },
  },
  {
    id: '주문의 물약',
    des: '순간적으로 주문력이 4 증가합니다. 주문력이 24 이하일 때만 사용가능합니다.',
    tag: ['potion'],
    func(who) {
      if(getstat('spell', who) <= 24) {
        setstat('spell', 4, who, true);
        enter('지식이 늘었다.')
      }
    },
  },
  {
    id: '흔한 약초',
    des: '체력이 서서히 회복됩니다.',
    tag: ['potion'],
    func(who) {
      getbuff('자연 치유', 5, who)
    },
  },
  {
    id: '느린 약초',
    des: '체력이 서서히 회복됩니다.',
    tag: ['potion'],
    func(who) {
      getbuff('느린 자연 치유', 10, who)
    },
  },
  {
    id: '숯돌',
    des: '왼손 무기에 공격형 수식을 붙힙니다.',
    tag: ['upgrade'],
    func(who) {
      
    },
  },
  {
    id: '황금 초대권',
    des: '석상의 형상이 그려져있는 초대권입니다. 사용 시 이동합니다. 주의하세요!',
    tag: ['potion'],
    func(who) {
      game.place = '황금방';
      game.situation = 'golden_room_input';
      tock()
    }
  },
  {
    id: '황금 석상 조각',
    des: '언젠간 쓰이겠지.',
    tag: ['potion'],
  },
  {
    id: '황금빛 석상의 오른손',
    des: '-',
    when_attack(who, to) {
      getbuff('압도', 1, to);
      setstat('attack', 2, who)
      if(who.health < 200) {
        enter('황금빛 석상의 손이 파괴됐다!')
        getbuff('단단한 방패', 3, who)
        setstat('attack', '50%', who)
        equip('mainhand', getdata(data.item, '아무것도 없음'), who)
      }
    },
    tag: ['potion'],
  },
  {
    id: '황금빛 석상의 몸',
    des: '-',
    when_attack(who, to) {
      if(!make_list(who.buff).includes) {
        getbuff('무감각', 8, to)
        getbuff('신경 파괴 대기 중', 12, who)
        enter('내 신경이 무감각해졌음이 느껴진다.')
      }
    },
    tag: ['potion'],
  },
]