data.skill = [
  {
    id: '평범한 마법',
    func(to, who) {
      deal(getstat('spell', who), to, who, 'spell')
    },
    cost: 10,
    des: '상대에게 주문력만큼의 피해를 줍니다.'
  },
  {
    id: '흡혈',
    func(to, who) {
      var how_dmg = deal(5+getstat('spell', who)*0.6, to, who, 'spell');
      heal(how_dmg, who)
      return how_dmg;
    },
    cost: 10,
    des: '상대에게 피해를 주고 흡혈합니다.'
  },
  {
    id: '화염덩어리',
    func(to, who) {
      how_dmg = deal(20 + getstat('spell', who)*0.2, to, who)
      return how_dmg;
    },
    cost: 8,
    des: '20(+주문력의 20%)의 피해를 주고 \'불타는 중...\' 효과를 4턴간 부여합니다.'
  },
  {
    id: '빛의 보호막',
    func(to, who) {
      heal(16+getstat('spell', who)*0.1, who);
      getbuff('영리함', 3, who)
      return 0;
    },
    cost: 8,
    des: '체력을 16(+주문력의 40%)을(를) 회복하고 주문력이 10 상승하는 \'영리함\' 효과를 3턴간 부여합니다.'
  },
  {
    id: '주문송곳니',
    func(to, who) {
      var how_dmg = deal(5+getstat('spell', who)*0.3, to, who, 'spell');
      manaheal(how_dmg, who)
      return how_dmg;
    },
    cost: 0,
    des: '상대에게 피해를 주고 마나를 흡혈합니다.'
  },
  {
    id: '흡수의 송곳니',
    func(to, who) {
      var how_dmg = deal(20+getstat('spell', who)*0.4, to, who, 'spell');
      heal(how_dmg, who)
      manaheal(how_dmg, who)
      return how_dmg;
    },
    cost: 0,
    des: '상대에게 20+주문력X0.7 피해를 주고 체력과 마나를 흡혈합니다.'
  },
  {
    id: '철퇴의 형상',
    func(to, who) {
      setstat('def', '-50%', to, true)
      var how_dmg = deal(5+getstat('attack', who), to, who, 'attack');
      return how_dmg;
    },
    cost: 20,
    des: '상대에게 방어력을 어느 정도 관통하는 물리 피해를 줍니다.'
  },
  {
    id: '티탄의 주먹',
    func(to, who) {
      var how_dmg = deal(to.health*0.1, to, who, 'attack');
      return how_dmg;
    },
    cost: 30,
    des: '상대 현재 체력의 10% 만큼의 물리 피해를 줍니다.'
  },
  {
    id: '처형자의 송곳니',
    func(to, who) {
      if(to.health <= getstat('attack', who)*2) {
        var how_dmg = deal(getstat('attack', who)*2, to, who, 'true');
        heal(how_dmg, who);
        console.log(how_dmg)
        return how_dmg;
      } else {
        enter('아직 상대의 체력이 '+getstat('attack', who)*2+'를 넘습니다.')
        return 0;
      }
    },
    cost: 20,
    des: '상대 체력이 내 공격력X2 이하라면 처형하고 그만큼 회복합니다.'
  },
]