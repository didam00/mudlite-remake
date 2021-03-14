// window.onload = function () {
  
// }

game.drop_item = []

function changechoice() {

}

data.situation = [
  {
    id: 'home',
    tag: [],
    func() {
      enter('벽돌 사이로 흰 빛이 세어나온다.')
      return false
    },
    choice: [
      {
        id: '걸어간다',
        func() {
          game.situation = 'village';
          game.place = '폐허 마을';
        },
      }
    ],
  },
  {
    id: 'village',
    tag: ['폐허 마을'],
    func() {
      enter('이곳은 마을. 평화로워 보이진 않는다.')
      return false
    },
    choice: [
      {
        id: '탐색한다',
        func() {
          getexp(random(12,4))
          game.situation = 'village_search#'+random(data.situation.filter(a => a.tag.includes('village_search')).length);
        },
      },
      {
        id: '다른 길로 가본다',
        func() {
          game.situation = 'dark-red-mosque';
          game.place = '검붉은 사원';
        },
      },
    ],
  },
  {
    id: 'village_search#0',
    tag: ['village_search'],
    func() {
      enter('돌아다니다 지뢰를 밟았다! 폭발로 부상을 입었다.')
      me.health -= 5; return false
    },
    choice: 'village',
  },
  {
    id: 'village_search_iron-chest',
    tag: [],
    func() {
      var random_item = data.item.filter(a => a.tag.includes('weapon'))
      random_item = random_item.random().id
      getitem(random_item)
      enter('상자를 겨우 끼워넣어 상자를 열었더니 '+random_item+'을(를) 얻었다.')
      return false
    },
    choice: 'village',
  },
  {
    id: 'village_search#2',
    tag: ['village_search'],
    func() {
      enter('잠긴 철 상자를 발견했다. 이것을 열려면 열쇠가 필요하다.')
      return false
    },
    choice: [
      {
        id: '열어본다',
        func() {
          getitem('철 상자 열쇠', -1);
          game.situation = 'village_search_iron-chest'
        },
        conditions() {
          return hasitem('철 상자 열쇠')
        }
      },
      {
        id: '탐색한다',
        func() {
          getexp(random(12,4))
          game.situation = 'village_search#'+random(data.situation.filter(a => a.tag.includes('village_search')).length);
        },
      },
      {
        id: '다른 길로 가본다',
        func() {
          game.situation = 'village';
        },
      },
    ],
  },
  {
    id: 'village_search#1',
    tag: ['village_search'],
    func() {
      enemy = {...getdata(data.entity, getdata(data.place, game.place).entity.random())};
      enemy.health = getstat('health', enemy);
      enemy.buff = [];
      enter(game.place+'에서 ' + enemy.id + '을(를) 만났다.');
      return false
    },
    choice: [
      {
        id: '공격한다',
        func() {
          game.situation = 'fight-attack'
        },
        conditions() {
          return (me.health > 0) && (enemy.health > 0)
        }
      },
      {
        id: '마법을 시전한다',
        func() {
          game.situation = 'fight-skill'
        },
        conditions() {
          return (me.mana >= me.skill.cost) && (me.health > 0) && (enemy.health > 0) && (me.skill.id != '평범한 마법')
        }
      },
      {
        id: '방패로 막는다',
        func() {
          game.situation = 'fight-block'
        },
        conditions() {
          return (me.health > 0) && (enemy.health > 0) && (me.equip.offhand.id != '아무것도 없음')
        }
      },
      {
        id: '가지고 떠난다',
        func() {
          for(var i = 0; i<drop_item.length; i += 2) {
            getitem(drop_item[i], drop_item[i+1])
          }
          game.situation = gettag(game.place)[0].id;
        },
        conditions() {
          return enemy.health <= 0
        }
      },
      {
        id: '그냥 떠난다',
        func() {
          game.situation = gettag(game.place)[0].id;
        },
        conditions() {
          return enemy.health <= 0
        }
      },
    ],
  },
  {
    id: 'fight-attack',
    tag: [],
    func() {
      var my_weapon = 0;
      var enemy_weapon = 0;
      var my_neck = 0;
      var enemy_neck = 0;
      var dmg = 0;
      var dmged = 0;
      var dmg_text = '';
      var dmged_text = '';
      var my_attack_count = 0;
      var my_attack_count_text = ''
      for(var i = 0; i<getstat('attack_speed'); i++) {
        if((i <= getstat('attack_speed')-1) || ((i == Math.trunc(getstat('attack_speed'))) && (Math.random() < (getstat('attack_speed') - Math.trunc(getstat('attack_speed')))))) {
          my_attack_count++
          dmg += deal(getstat('attack'), enemy, me);
          my_weapon += event_check(me, 'mainhand', 'when_attack')
          my_neck += event_check(me, 'neck', 'when_attack')
        }
      }
      dmg += my_weapon + my_neck
      if(my_attack_count != 1) {
        my_attack_count_text = my_attack_count.toString()+'번 공격하고 '
      }
      if(getstat('speed') / (getstat('attack', enemy) + getstat('speed')) > Math.random()) {
        dmged_text = '상대가 나에게 공격을 시도했지만 <b>회피</b>했다.'
      } else {
        enemy_weapon = event_check(enemy, 'mainhand', 'when_attack')
        enemy_neck = event_check(enemy, 'neck', 'when_attack')
        dmged = deal(getstat('attack', enemy), me, enemy) + enemy_weapon + enemy_neck;
        if(dmged != 0) {
          dmged_text = '나는 '+dmged+'만큼의 피해를 입었다.';
        } else {
          dmged_text = '상대가 나에게 공격을 시도했지만 <b>아무 피해</b>도 받지 않았다.';
        }
      }
      var how_heal = heal(Math.floor(dmg*getstat('vampire')));
      if(dmg != 0) {
        dmg_text = enemy.id + '에게 '+my_attack_count_text+dmg.toString()+'만큼의 피해를 입혀 '+enemy.health+'만큼의 체력이 남았고 ';
      } else {
        dmg_text = enemy.id + '에게 공격을 시도했지만 아무 피해도 받지 않았고 '
      }
      
      enter(dmg_text+dmged_text);
      if(how_heal != 0) {
        enter('나의 체력이 흡혈로 '+how_heal+'만큼 회복되었다. #체력회복')
      }
      var enemy_how_heal = heal(Math.floor(dmged*getstat('vampire', enemy), enemy))
      if(enemy_how_heal != 0) {
        enter('상대의 체력이 흡혈로 '+enemy_how_heal+'만큼 회복되었다. #체력회복')
      }
      if(me.health <= 0) {
        enter('나는 사망했다.');
      } else if(enemy.health <= 0) {
        drop_item = [];
        drop_text = [];
        for(var i = 0; i < enemy.drop_item.length; i++) {
          var getitem_decrease = 0;
          if(me.buff.includes('아이템의 저주')) {
            getitem_decrease = 5
          }
          var how = random(enemy.drop_item[i].how[1]+1 - getitem_decrease, enemy.drop_item[i].how[0])
          if(how > 0) {
            drop_item.push(enemy.drop_item[i].id, how)
            drop_text.push(enemy.drop_item[i].id+' '+how+'개')
          }
        }
        if(drop_item.length == 0) {
          enter('상대는 사망했다.');
        } else {
          enter('상대는 사망했다. 상대는 '+(drop_text.join(', '))+'을(를) 떨어뜨렸다.');
        }
        var getgold = Math.floor(random(me.level*3, 0) + me.level*1.5 + 10)
        me.gold += getgold
        enter('경험치를 '+getexp(random(Math.floor(enemy.level/me.level*50), Math.floor(enemy.level/me.level*30))).exp+'만큼 획득하였고, 골드를 '+getgold+'만큼 획득하였다.')
      }
      return false
    },
    choice: 'village_search#1',
  },
  {
    id: 'fight-skill',
    tag: [],
    func() {
      var dmg = me.skill.func(enemy, me)
      var dmged = deal(getstat('attack', enemy), me, enemy)
      var my_weapon = event_check(me, 'mainhand', 'when_skill')
      var my_shield = event_check(me, 'offhand', 'when_skill')
      var my_neck = event_check(me, 'neck', 'when_skill')
      var enemy_weapon = event_check(enemy, 'mainhand', 'when_attack')
      var enemy_shield = event_check(enemy, 'offhand', 'when_attack')
      var enemy_neck = event_check(enemy, 'neck', 'when_attack')
      dmg += my_weapon + my_shield + my_neck;
      dmged += enemy_weapon + enemy_shield + enemy_neck;
      me.mana -= me.skill.cost;
      var dmg_text = '';
      var dmged_text = '';
      if(dmg != 0) {
        dmg_text = "나는 '"+me.skill.id+"'을(를) 사용해 "+enemy.id + '에게 '+dmg+'만큼의 피해를 입혀 '+enemy.health+'만큼의 체력이 남았고 ';
      } else {
        dmg_text = '나는 주문을 사용했지만 아무 피해도 주지 않았고 '
      }
      if(dmged != 0) {
        dmged_text = '나는 '+dmged+'만큼의 피해를 입었다.';
      } else {
        dmged_text = '상대가 나에게 공격을 시도했지만 아무 피해를 받지 않았다.';
      }
      enter(dmg_text+dmged_text);
      var enemy_how_heal = heal(Math.floor(dmged*getstat('vampire', enemy), enemy))
      if(enemy_how_heal != 0) {
        enter('상대의 체력이 흡혈로 '+enemy_how_heal+'만큼 회복되었다. #체력회복')
      }
      if(me.health <= 0) {
        enter('나는 사망했다.');
      } else if(enemy.health <= 0) {
        drop_item = [];
        drop_text = [];
        for(var i = 0; i < enemy.drop_item.length; i++) {
          var how = random(enemy.drop_item[i].how[1]+1, enemy.drop_item[i].how[0])
          if(how > 0) {
            drop_item.push(enemy.drop_item[i].id, how)
            drop_text.push(enemy.drop_item[i].id+' '+how+'개')
          }
        }
        if(drop_item.length == 0) {
          enter('상대는 사망했다.');
        } else {
          enter('상대는 사망했다. 상대는 '+(drop_text.join(', '))+'을(를) 떨어뜨렸다.');
        }
      }
      return false
    },
    choice: 'village_search#1',
  },
  {
    id: 'fight-block',
    tag: [],
    func() {
      var dmged = 0;
      if(me.equip.offhand.firmness < Math.random()) {
        me.equip.offhand.durability--
      }
      var enemy_weapon = event_check(enemy, 'offhand', 'when_attack')
      var enemy_neck = event_check(enemy, 'neck', 'when_attack')
      var my_neck = event_check(me, 'neck', 'when_block')
      if(Math.random() < getstat('block')/(getstat('block') + enemy.level*10)) {
        enter('나는 방패를 들고 상대의 공격을 막아냈다. 완전방어수치가 증가했다.');
        var my_shield = event_check(me, 'offhand', 'when_block')
        setstat('block', 1*enemy.level/me.level)
      } else {
        dmged = deal(getstat('attack', enemy), me, enemy) + enemy_weapon + enemy_neck;
        enter('나는 방패를 들고 막았지만 상대의 공격을 막지 못하고 '+dmged+'의 피해를 받았다. 완전방어수치가 낮아졌다.');
        var my_shield = event_check(me, 'offhand', 'when_block_failed')
        setstat('block', -2*me.level/enemy.level)
      }
      var enemy_how_heal = heal(Math.floor(dmged*getstat('vampire', enemy), enemy))
      if(enemy_how_heal != 0) {
        enter('상대의 체력이 흡혈로 '+enemy_how_heal+'만큼 회복되었다. #체력회복')
      }
      if(me.equip.offhand.durability <= 0) {
        enter('왼손에 들고있던 방패가 파괴됐다!')
        equip('offhand', getdata(data.item, '아무것도 없음'))
        me.inventory.splice(-1, 1)
      }
      if(me.health <= 0) {
        enter('나는 사망했다.');
      } else if(enemy.health <= 0) {
        drop_item = [];
        drop_text = [];
        for(var i = 0; i < enemy.drop_item.length; i++) {
          var how = random(enemy.drop_item[i].how[1]+1, enemy.drop_item[i].how[0])
          if(how > 0) {
            drop_item.push(enemy.drop_item[i].id, how)
            drop_text.push(enemy.drop_item[i].id+' '+how+'개')
          }
        }
        if(drop_item.length == 0) {
          enter('상대는 사망했다.');
        } else {
          enter('상대는 사망했다. 상대는 '+(drop_text.join(', '))+'을(를) 떨어뜨렸다.');
        }
      }
      return false
    },
    choice: 'village_search#1',
  },
  {
    id: 'dark-red-mosque',
    tag: ['검붉은 사원'],
    func() {
      enter('주변이 온통 검정색과 붉은색으로 물들여져있다.')
      return false
    },
    choice: [
      {
        id: '탐색한다',
        func() {
          getexp(random(12,4))
          game.situation = 'dark-red-mosque#'+random(data.situation.filter(a => a.tag.includes('dark-red-mosque')).length);
        },
      },
    ],
  },
  {
    id: 'dark-red-mosque#0',
    tag: ['dark-red-mosque'],
    func: 'village_search#1',
    choice: 'village_search#1',
  },
  {
    id: 'dark-red-mosque#1',
    tag: ['dark-red-mosque'],
    func() {
      enter('돌아다니다 가시함정에 걸렸다')
      getbuff('출혈 II', 3);
      return false
    },
    choice: 'dark-red-mosque',
  },
  {
    id: 'dark-red-mosque#2',
    tag: ['dark-red-mosque'],
    func() {
      enter('이상한 문과 옆에 열쇠구멍이 있다')
      me.health -= 18;
      return false
    },
    choice: [
      {
        id: '탐색한다',
        func() {
          getexp(random(12,4))
          game.situation = 'dark-red-mosque#'+random(data.situation.filter(a => a.tag.includes('dark-red-mosque')).length);
        },
      },
      {
        id: '들어간다',
        func() {
          game.situation = 'golden-underground';
          game.place = '금빛 지하';
        },
        conditions() {return hasitem('지하 열쇠')}
      }
    ],
  },
  {
    id: 'dark-red-mosque#3',
    tag: ['dark-red-mosque'],
    func() {
      enter('영혼 조각 80개를 소요해 영혼을 압축시킬 수 있는 영혼 압축기가 보인다.')
      return false
    },
    choice: [
      {
        id: '돌아간다',
        func() {
          game.situation = gettag(game.place)[0].id;
        },
      },
      {
        id: '영혼을 압축시킨다',
        func() {
          game.situation = 'make-soul';
        },
        conditions() {return hasitem('영혼 조각', 80)}
      },
      {
        id: '해골 인형을 제작한다',
        func() {
          game.situation = 'make-bone-doll';
        },
        conditions() {return hasitem('영혼', 6) && hasitem('부서진 뼈', 50);}
      },
      {
        id: '저주와 함께 날린다',
        func() {
          game.situation = 'curse-bone-doll';
        },
        conditions() {return hasitem('해골 인형', 1) && (me.mana >= 50);}
      },
    ],
  },
  {
    id: 'make-soul',
    tag: [],
    func() {
      getitem('영혼 조각', -80)
      getitem('영혼')
      enter('영혼 압축기로 영혼을 제작했다. 비명소리가 들린다.')
      return false
    },
    choice: 'dark-red-mosque#3',
  },
  {
    id: 'make-bone-doll',
    tag: [],
    func() {
      getitem('영혼', -6)
      getitem('부서진 뼈', -50)
      getitem('해골 인형', 1)
      enter('영혼 압축기로 해골 인형을 얻었다. 여기서 50 마나를 소모해 1의 저주와 함께 날릴 수 있다.')
      return false
    },
    choice: 'dark-red-mosque#3',
  },
  {
    id: 'curse-bone-doll',
    tag: [],
    func() {
      getitem('해골 인형', -1)
      setstat('curse', -1)
      me.mana -= 50
      enter('해골 인형을 안정적으로 내보냈다.')
      return false
    },
    choice: 'dark-red-mosque#3',
  },
  {
    id: 'dark-red-mosque#4',
    tag: ['dark-red-mosque'],
    func: 'village_search#1',
    choice: 'village_search#1',
  },
  {
    id: 'golden-underground',
    tag: ['금빛 지하'],
    func() {
      enter('모든 곳에서 황금 빛이 보인다.')
      return false
    },
    choice: [
      {
        id: '탐색한다',
        func() {
          getexp(random(12,4))
          game.situation = 'golden-underground#'+random(data.situation.filter(a => a.tag.includes('golden-underground')).length);
        },
      },
    ],
  },
  {
    id: 'golden-underground#1',
    tag: ['golden-underground'],
    func: 'village_search#1',
    choice: 'village_search#1',
  },
  {
    id: 'golden-underground#2',
    tag: ['golden-underground'],
    func() {
      enter('누군가 사용했던 망치가 꽂힌 모루가 보인다.')
      return false
    },
    choice: [
      {
        id: '강화한다 (오른손)',
        func() {

        },
        conditions() {return me.equip.mainhand.id != '아무것도 없음'}
      },
      {
        id: '강화한다 (왼손)',
        func() {

        },
        conditions() {return me.equip.offhand.id != '아무것도 없음'}
      },
      {
        id: '강화한다 (장신구)',
        func() {

        },
        conditions() {return me.equip.neck.id != '아무것도 없음'}
      },
    ],
  },
  {
    id: 'anvil-right',
    tag: [],
    func() {
      enter('')
      return false
    },
    choice: 'golden-underground#2'
  },
  {
    id: 'golden_room_input',
    tag: [],
    func() {
      enter('이 방은 온 곳이 황금빛으로 채워져있다. 앞에 티키 횃불 사이로 거대한 문이 있다.')
      return false
    },
    choice: [
      {
        id: '들어간다',
        func() {
          game.situation = 'golden_room'
        },
      }
    ]
  },
  {
    id: 'golden_room',
    tag: [],
    func() {
      enemy = getdata(data.entity, '거대한 황금빛 석상')
      enemy.health = getstat('health', enemy);
      enemy.buff = [];
      enter('거대한 황금빛 석상은 나를 지켜보고 있다.')
      return false
    },
    choice: 'village_search#1'
  },
]