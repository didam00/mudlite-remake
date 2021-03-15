window.oncontextmenu = function () {
  return false;
};

var right_click_on = false;

var info = {
  critical: false,
  ismobile: false,
}

var finger_move_x = 0;
var finger_move_y = 0;

var system = {
  version: '1.0.2-2',
}

if ( navigator.platform ) {
  if ( "win16|win32|win64|mac|macintel".indexOf(navigator.platform.toLowerCase() ) < 0 ) {info.ismobile = true;}
}

window.onload = function () {
  // 스킬 읽어서 주문책 추가
  for(var i = 0; i<data.skill.length; i++) {
    data.item.push({
      id: '<'+data.skill[i].id+'> 마법책',
      des: '주문 \''+data.skill[i].id+'\'을(를) 배웁니다.<br>\''+data.skill[i].des+'\'',
      tag: ['spell-book'],
      skill: data.skill[i],
      func(who) {
        enter('새로운 마법을 배운 기분이 든다. #새로운_마법')
        me.skill = this.skill
      },
    })
  }

  // 초이스 문자열을 배열로 변환
  for(let i = 0; i<data.situation.length; i++) {
    if(typeof data.situation[i].choice == 'string') {
      data.situation[i].choice = getdata(data.situation, data.situation[i].choice).choice;
    }
  }

  while(character_list.length != 8) {
    character_list.splice(random(character_list.length)-1, 1)
  }

  for(let i = 0; i<character_list.length; i++) {
    var cha_data = character_list[i];
    var new_cha = $('<div id="'+cha_data.id+'" class="not-selected">'+cha_data.id+'</div>')
    $('.new-profile .list').append(new_cha)
    $('.new-profile .list div')[i].onclick = function () {
      caption(getdata(character_list, $(this).attr('id')).des)
      if($('.new-profile .list div')[i].className == 'not-selected') {
        me.character.push(character_list[i].id)
        $('.new-profile .list div')[i].className = 'selected';
        $('.new-profile .list div')[i].style.background = 'hsla('+Math.floor(Math.random()*360+1)+', 40%, 60%, 63%)';
      } else {
        me.character.delete(character_list[i].id)
        $('.new-profile .list div')[i].className = 'not-selected';
        $('.new-profile .list div')[i].style.background = '';
      }

      // 저주 계수 표시
      $('.new-profile .okay').css('background', '#c27d94')
      setTimeout(() => {
        $('.new-profile .okay').css('background', '')
      }, 200);
      $('.new-profile .okay').html(Math.floor(Math.pow($('.new-profile .list .selected').length, 1.4))+'개의 저주와 함께..')
    }
  }

  $('.new-profile .okay').on('click', function () {
    $('.new-profile').css('filter', 'blur(10px)')
    $('.new-profile').css('top', 'calc(50% - 20px)')
    $('.new-profile').css('opacity', '0')
    for(var i = 0; i<me.character.length; i++) {
      getdata(character_list, me.character[i]).func()
    }
    setstat('curse', Math.floor(Math.pow($('.new-profile .list .selected').length, 1.4)))
    setTimeout(function () {
      $('.new-profile').remove()
    }, 300)
    tock()
    $('title').text('▶ 피드')
  })

  var toggle_tab = false;

  if(info.ismobile) {
    $('html').on('touchstart', function (event) {
      finger_move_x = event.changedTouches[0].screenX;
      finger_move_y = event.changedTouches[0].screenY;
    })
    $('html').on('touchend', function (event) {
      finger_move_x -= event.changedTouches[0].screenX;
      finger_move_y -= event.changedTouches[0].screenY;

      if(finger_move_x > 40 && Math.abs(finger_move_y) < 20 && !toggle_tab) {
        $('.info').css('left', '0px')
      }
      if(finger_move_x < -40 && Math.abs(finger_move_y) < 20 && !toggle_tab) {
        $('.info').css('left', '100%')
      }
      if(finger_move_x < -40 && Math.abs(finger_move_y) < 20 && toggle_tab) {
        $('.inventory').css('left', '100%')
        toggle_tab = false;
        $('.show-inventory').toggleClass('button')
        $('.show-inventory').toggleClass('button-pressed')
      }
    })
  } else {
    $('.info').on('mouseover', function () {
      if(!toggle_tab) {
        $('.choice-list').css('right', '210px')
        $('.info').css('right', '0px')
      }
    })
    
    $('.info').on('mouseout', function () {
      if(!toggle_tab) {
        $('.choice-list').css('right', '20px')
        $('.info').css('right', '-208px')
      }
    })
  }

  
  $('.show-inventory').on('click', function () {
    if($('.show-inventory').is('.button')) {
      $('.choice-list').css('right', '400px')
      $('.inventory').css('left', '0px')
      toggle_tab = true
    } else {
      $('.choice-list').css('right', '210px')
      $('.inventory').css('left', '100%')
      toggle_tab = false
    }
    $('.show-inventory').toggleClass('button')
    $('.show-inventory').toggleClass('button-pressed')
    tick()
  })
  
  $('.space').on('click', function () {
    if(toggle_tab) {
      toggle_tab = false;
      $('.info').css('right', '-208px')
      $('.inventory').css('left', '0px')
      $('.choice-list').css('right', '20px')
      $('.show-inventory').toggleClass('button')
      $('.show-inventory').toggleClass('button-pressed')
      tick()
    }
  })

  $('#Capa_1').on('click', function () {
    
  })

  tick()
}

function minus(num) {
  if(num.toString().slice(-1) == '%') {
    return (-Number(num.replace('%', '')))+'%'
  } else {
    return -Number(num)
  }
}

function getbuff(id, how=6, who=me) {
  if(who == me) {
    if(me.character.includes('빠른 흡수')) {
      how *= 2
    }
  }
  if(who.stat.hasOwnProperty('buff_eff')) {
    if(!getdata(data.buff, id).tag.includes('debuff')) {
      how = Math.floor(how * getstat('buff_eff', who))
    }
  }
  if(who.stat.hasOwnProperty('debuff_eff')) {
    if(getdata(data.buff, id).tag.includes('debuff')) {
      how = Math.floor(how * getstat('debuff_eff', who))
    }
  }
  if(make_list(who.buff).includes(id)) {
    if(getdata(who.buff, id).times < how) {
      who.buff.filter(a => a.id == id)[0].times = how
    }
  } else {
    var databuff = getdata(data.buff, id);
    databuff.times = how;
    if(databuff.hasOwnProperty('stat')) {
      for(var i = 0; i<Object.keys(databuff.stat).length; i++) {
        setstat(Object.keys(databuff.stat)[i], databuff.stat[Object.keys(databuff.stat)[i]], who)
      }
    }
    who.buff.push(databuff);
  }
  tick()
}

function event_check(who, part, ev) {
  if(who.hasOwnProperty('equip')) {
    if(who.equip[part].hasOwnProperty(ev)) {
      return who.equip[part][ev](who, (who == me) ? enemy : me);
    } else return 0;
  } else return 0;
}

function gettag(tagname) {
  return data.situation.filter(a => a.tag.includes(tagname))
}

function hasitem(id, how=1, who=me) {
  if(how == 1) {
    return make_list(me.inventory).includes(id);
  } else {
    if(getdata(me.inventory, id).how >= how) {return true} else return false;
  }
}

function upgrade(item) {
  if((me.character.includes('대장장이') && Math.random() <= 0.5) || !me.character.includes('대장장이')) {
    for(let i = 0; i<Object.keys(item.stat).length; i++) {
      var original = item.stat[Object.keys(item.stat)[i]]
      item.stat[Object.keys(item.stat)[i]] *= 1.15
      item.stat[Object.keys(item.stat)[i]] = Math.floor(item.stat[Object.keys(item.stat)[i]]*100)/100
      setstat(Object.keys(item.stat)[i], item.stat[Object.keys(item.stat)[i]] - original)
    }
    item.upgrade++
    enter(item.id+'을(를) 강화하였다! #강화')
    if(me.character.includes('대장장이')) {
      for(let i = 0; i<Object.keys(item.stat).length; i++) {
        var original = item.stat[Object.keys(item.stat)[i]]
        item.stat[Object.keys(item.stat)[i]] *= 1.15
        item.stat[Object.keys(item.stat)[i]] = Math.floor(item.stat[Object.keys(item.stat)[i]]*100)/100
        setstat(Object.keys(item.stat)[i], item.stat[Object.keys(item.stat)[i]] - original)
      }
      item.upgrade++
      enter('대장장이 성격으로 '+item.id+'을(를) 한번 더 강화했다! #대장장이_성공')
    }
  } else {
    enter('대장장이 강화에 실패했다... #대장장이_실패')
  }
  return item;
}

function getdata(where, id) {
  return {...where.filter(a => a.id == id)[0]};
}

let date_data = new Date(1991, 0, 1, 0, 0);

let enemy;

let me = {
  id: 'player',
  health: 80,
  mana: 50,
  exp: 0,
  level: 1,
  tension: 100,
  weapon_confusion: 0,
  character: [],
  buff: [],
  gold: 0,
  equip: {
    mainhand: {
      id: '아무것도 없음',
      stat: [],
    },
    offhand: {
      id: '아무것도 없음',
      stat: [],
    },
    neck: {
      id: '아무것도 없음',
      stat: [],
    },
  },
  stat: {
    health: {c: 80, extra: 0, extra_per: 0, per: 1},
    mana: {c: 50, extra: 0, extra_per: 0, per: 1},
    attack: {c: 9, extra: 0, extra_per: 0, per: 1},
    spell: {c: 0, extra: 0, extra_per: 0, per: 1},
    def: {c: 9, extra: 0, extra_per: 0, per: 1}, // 곱연산
    reg: {c: 4, extra: 0, extra_per: 0, per: 1}, // 곱연산
    block: {c: 20, extra: 0, extra_per: 0, per: 1}, // 완전 방어 수치
    ignore_def: {c: 0, extra: 0, extra_per: 0, per: 1},
    ignore_reg: {c: 0, extra: 0, extra_per: 0, per: 1},
    critical: {c: 0.02, extra: 0, extra_per: 0, per: 1}, // 곱연산
    attack_speed: {c: 1, extra: 0, extra_per: 0, per: 1},
    speed: {c: 0.1, extra: 0, extra_per: 0, per: 1}, // (dodge, work-speed)\
    
    // hide stat
    hit: {c: 1, extra: 0, extra_per: 0, per: 1}, // 상대의 speed에 따른 명중률
    sense: {c: 0, extra: 0, extra_per: 0, per: 1}, // 감각력, 적 탐지 등에 쓰임
    critical_damage: {c: 1.5, extra: 0, extra_per: 0, per: 1},
    learning_ability: {c: 1, extra: 0, extra_per: 0, per: 1}, // 습득력 - 경험치 얻는 정도
    luck: {c: 0, extra: 0, extra_per: 0, per: 1},
    will: {c: 0, extra: 0, extra_per: 0, per: 1}, // 의지 = 강인함
    frd: {c: 0, extra: 0, extra_per: 0, per: 1}, // friendly 사교력
    karma: {c: 0, extra: 0, extra_per: 0, per: 1}, // 카르마 - 선, 악
    vampire: {c: 0, extra: 0, extra_per: 0, per: 1},
    health_regen: {c: 0.8, extra: 0, extra_per: 0, per: 1},
    mana_regen: {c: 0.8, extra: 0, extra_per: 0, per: 1},
    curse: {c: 0, extra: 0, extra_per: 0, per: 1},
    buff_eff: {c: 1, extra: 0, extra_per: 0, per: 1},
    debuff_eff: {c: 1, extra: 0, extra_per: 0, per: 1},
  },
  inventory: [],
  skill: {
    id: '평범한 마법',
    func(to, who) {
      
    },
    cost: 10,
    des: '당신이 쓸 수 없어요.'
  }
}

function equip(part, inv, who=me) {
  if(typeof inv == "number") {
    if((part == 'neck') && !who.inventory[inv].tag.includes('acc')) {
      caption('해당 아이템은 장신구가 아닙니다!')
      return false;
    }
    if(who.equip[part].id != '아무것도 없음') {
      for(var i = 0; i < Object.keys(who.equip[part].stat).length; i++) {
        setstat(Object.keys(who.equip[part].stat)[i], -who.equip[part].stat[Object.keys(who.equip[part].stat)[i]] * (part == 'mainhand' ? 1.25 : 1));
      }
      getitem(who.equip[part])
    }
    for(var i = 0; i < Object.keys(who.inventory[inv].stat).length; i++) {
      setstat(Object.keys(who.inventory[inv].stat)[i], who.inventory[inv].stat[Object.keys(who.inventory[inv].stat)[i]] * (part == 'mainhand' ? 1.25 : 1));
    }
    who.equip[part] = {...who.inventory[inv]}
    who.inventory.splice(inv, 1)
  } else {
    if(who.equip[part].id != '아무것도 없음') {
      for(var i = 0; i < Object.keys(who.equip[part].stat).length; i++) {
        setstat(Object.keys(who.equip[part].stat)[i], -who.equip[part].stat[Object.keys(who.equip[part].stat)[i]] * (part == 'mainhand' ? 1.25 : 1));
      }
      getitem(who.equip[part])
    }
    for(var i = 0; i < Object.keys(inv.stat).length; i++) {
      setstat(Object.keys(inv.stat)[i], inv.stat[Object.keys(inv.stat)[i]] * (part == 'mainhand' ? 1.25 : 1));
    }
    who.equip[part] = inv
  }
  me.weapon_confusion += 21;
  tick()
  return who.equip[part];
}

function setstat(stat, value, obj=me, isextra=false) {
  if(obj==me) {
    if(me.character.includes('고기방패') && (stat=='def' || stat=='reg')) {
      return 0;
    }
  }
  var child;
  if(value.toString().indexOf('%')!=-1) {
    if(isextra) {child = 'extra_per'} else {child = 'per'}
  } else {
    if(isextra) {child = 'extra'} else {child = 'c'}
  }
  if((obj == me) && me.character.includes('심해') && (stat == 'health' || stat == 'mana')) {
    enter('심해의 성격으로 인해 '+stat+'이 '+stat+' regeneration으로 변경돼었다. #심해_알림')
    if(value.toString().indexOf('%')!=-1) {
      me.stat[stat+'_regen'][child] += Number(value.slice(0, -1))/100;
    } else {
      me.stat[stat+'_regen'][child] += Number(value)/50;
    }
  } else {
    if(value.toString().indexOf('%')!=-1) {
      obj.stat[stat][child] += Number(value.slice(0, -1))/100;
    } else {
      obj.stat[stat][child] += Number(value)
    }
  }
  tick();
  return obj.stat[stat][child];
}

function getexp(num) {
  if(me.character.includes('연구원')) {
    setstat('spell', Math.ceil(num *= 5)/100)
    num = 0;
    enter('연구원은 경험치를 모두 주문력으로 전환합니다. #연구원_알림')
  }
  var howmanylevelup = {lv: 0, exp: num};
  me.exp += num
  function levelupcheck() {
    if(me.exp >= (me.level-1) * 30 + 90) {
      me.level += 1
      howmanylevelup.lv += 1;
      me.exp -= (me.level-1) * 30 + 90

      setstat('health', 14)
      setstat('health_regen', 0.14)
      heal(14)
      setstat('attack', 1.6)
      setstat('def', 1.6)
      setstat('reg', 0.8)
      setstat('block', 1)
      setstat('speed', 0.02)
      levelupcheck()
    }
  }
  if(me.exp >= (me.level-1) * 30 + 90) {
    levelupcheck()
    enter('숙련됨을 느낀다. #레벨업 #'+me.level+'레벨')
  }
  tick()
  return howmanylevelup;
}

function getstat(stat, obj=me) {
  return Math.floor((obj.stat[stat].c + obj.stat[stat].extra) * (obj.stat[stat].per + obj.stat[stat].extra_per)*100)/100;
}

Array.prototype.delete = function (text) {
  return this.splice(this.indexOf(text), 1)
}

function block_tag(a) {

  game.block_tag.push(a);
  caption('\''+a+'\' 태그가 차단되었습니다.')
}

function enter(a) {
  for(var i = 0; i < game.block_tag.length; i++) {
    if(a.includes(game.block_tag[i])) {
      return false;
    }
  }

  var text = a.replace(/(#[^\s]+)/gi, '<i class="hashtag" onmouseup="block_tag(`$1`)">$1</i>')
  var textlog = $('<div class="log"></div>');
  var content = $('<div class="content">'+text+'</div>');
  var date_info = $('<div class="date-info">'+dtt(date_data)+'</div>');
  textlog.append(content);
  textlog.append(date_info);
  textlog.css('display', 'none');
  $('.space').prepend(textlog);
  textlog.ready(function () {
    $('.space').css('transition', 'none')
    textlog.css('display', 'block');
    $('.space').css('top', (8 - textlog.height())+'px')
    setTimeout(function () {
      $('.space').css('transition', 'all 150ms ease-out')
      $('.space').css('top', '8px')
    },1)
  })
}

var captiontimeout;

function caption(text) {
  clearTimeout(captiontimeout)
  $('.caption').html(text)
  $('.caption').css('display', 'block')
  captiontimeout = setTimeout(() => {
    $('.caption').css('display', 'none')
  }, 3000);
}

function random(end, start=0) {
  return Math.floor(Math.random()*(end-start))+start;
}

Array.prototype.random = function () {
  return this[random(this.length)];
}

function coinflip() {
  if(Math.random() > 0.5) return true
  else return false;
}

function digital(a, l=2) {
  var x = a.toString();
  while(x.length < l) {
    x = '0'+x
  }
  return x;
}

function dtt(a) { // date to text
  return digital(a.getYear()-91, 4) + '.' + digital(a.getMonth() + 1) + '.' + digital(a.getDate()) + ' ' + digital(a.getHours()) + ':' + digital(a.getMinutes());
}

function getitem(id, how=1) {
  if(typeof id == 'string') {
    var itemdata = getdata(data.item, id)
    if(itemdata.tag.includes('weapon')) {
      itemdata.upgrade = 0
      me.inventory.push(itemdata)
    } else {
      if(make_list(me.inventory).includes(id)) {
        me.inventory[make_list(me.inventory).indexOf(id)].how += how;
        if(me.inventory[make_list(me.inventory).indexOf(id)].how <= 0) {
          me.inventory.splice(make_list(me.inventory).indexOf(id), 1)
        }
      } else {
        if(how <= 0) {return false}
        me.inventory.push({
          id: id,
          how: how,
        })
      }
    }
  } else if(typeof id == 'object') {
    me.inventory.push(id)
  }
  tick()
  return itemdata;
}

let character_list = [
  {
    id: '심해',
    func() {/* 추가 체력을 체력 재생으로 전환 */},
    des: '추가 체력을 체력 재생을 전환합니다.',
  },
  {
    id: '고기방패',
    func() {setstat('health', '100%'); me.health += 100; me.stat.def.c = 0; me.stat.reg.c = 0;},
    des: '체력이 증가하는 대신 방어력과 저항력이 사라집니다.',
  },
  {
    id: '연구원',
    func() {/* 경험치를 주문력으로 전환 */},
    des: '얻은 경험치를 주문력으로 전환합니다.',
  },
  {
    id: '대장장이',
    func() {},
    des: '강화 성공 확률이 50%가 되는 대신 한번에 두번 강화됩니다.',
  },
  {
    id: '분노조절장애',
    func() {/* 잃은 체력 1%당 공격력 !% 증가, 방어력과 저항력 1% 감소 */},
    des: '잃은 체력 1%당 공격력 1% 증가, 방어력과 저항력 1% 감소합니다.',
  },
  {
    id: '도박꾼',
    func() {/* 10분마다 무작위 스탯 (공격력, 방어력, 저항력, 주문력, 물리관통력,  마법관통력, 행운) 이 20% 증가하거나 감소 */},
    des: '매번 무작위 스탯이 증가되거나 감소합니다.',
  },
  {
    id: '거인살해자',
    func() {/* 모든 피해가 최소 상대 체력의 2% 만큼은 들어가게 됩니다. */},
    des: '모든 피해가 최소 상대 체력의 2% 만큼은 들어가게 됩니다.',
  },
  {
    id: '환각',
    func() {},
    des: '매 턴 무작위 버프를 나에게 시전합니다.',
  },
  {
    id: '빠른 흡수',
    func() {},
    des: '얻는 버프들의 기간이 두배가 됩니다. (디버프, 쿨타임 포함)',
  },
  {
    id: '피의 축제',
    func() {/* 모든 피해가 최소 상대 체력의 2% 만큼은 들어가게 됩니다. */},
    des: '모든 피해가 두 배로 증가합니다!',
  },
]

// 가나다 순으로 정렬시키기

function make_choice(arr, reset=true) {
  if(reset) {
    $('.choice-list').css('bottom', '-61px')
    setTimeout(() => {
      $('.choice-list').html('')
      for(let i = 0; i<arr.length; i++) {
        var new_choice = $('<div>'+arr[i]+'</div>')
        new_choice.on('click', function () {
          selected(arr[i])
        })
        $('.choice-list').append(new_choice)
      }
      $('.choice-list').css('bottom', '20px')
    }, 200);
  }
  // else {
  //   for(let i = 0; i<arr.length; i++) {
  //     var new_choice = $('<div>'+arr[i]+'</div>')
  //     new_choice.on('click', function () {
  //       selected(arr[i])
  //     })
  //     $('.choice-list').append(new_choice)
  //   }
  // }
}

function selected(what) {
  var situdata = getdata(data.situation, game.situation);
  // if(typeof getdata(situdata.choice, what).func == 'string') {
  //   getdata(data.situation, getdata(situdata.choice, what).func).func()
  // } else {
  getdata(situdata.choice, what).func();
  // }
  // getdata(data.situation, game.situation).func();
  tock();
}

function heal(how, to=me, who=null) {
  if(make_list(to.buff).includes('깊은 상처')) {
    how *= 0.5
  }
  to.health += how
  return how;
}

function manaheal(how, to=me, who=null) {
  to.mana += how
}

function deal(how, to=me, who=null, type='attack', simulation=false) {
  var damage = how;
  info.critical = false;
  if(who.hasOwnProperty('equip')) {
    if((who.equip.mainhand == '초심자의 마법서') && type == 'spell') {
      how += 10 + who.equip.mainhand.upgrade*0.7
    }
  }
  if(type == 'attack') {
    if(who.stat.hasOwnProperty('critical')) {
      if(Math.random() < getstat('critical', who)) {
        how *= who.stat.hasOwnProperty('critical_damage') ? getstat('critical_damage', who) : 1.5;
        info.critical = true;
      }
    }
    var to_def = getstat('def', to) - ((who != null) ? (who.stat.hasOwnProperty('ignore_def') ? getstat('ignore_def', who) : 0) : 0);
    // console.log((who != null) ? (who.stat.hasOwnProperty('ignore_def') ? getstat('ignore_def', who) : 0) : 0)
    var damage = Math.floor(how * (1 - to_def / (to_def+200)) - to_def * 0.2);
  } else if(type == 'spell') {
    var to_reg = getstat('reg', to) - ((who != null) ? (who.stat.hasOwnProperty('ignore_reg') ? getstat('ignore_reg', who) : 0) : 0);
    var damage = Math.floor(how * (1 - to_reg / (to_reg+200)) - to_reg * 0.2);
  }
  if(damage < 0) {damage = 0}
  if(me.character.includes('피의 축제')) {
    damage *= 2
  }
  if(!simulation) {
    to.health -= damage
  }

  if(me.character.includes('거인살해자') && (damage < getstat('health', to)/50)) {damage = getstat('health', to)/50}
  return damage;
}

function tock() {
  date_data.setMinutes(date_data.getMinutes()+10)
  if(me.character.includes('도박꾼')) {
    if(coinflip()) {var a = random(41, 10)} else {var a = -random(41, 10)}
    setstat(['attack', 'spell', 'def', 'reg', 'ignore_def', 'ignore_reg', 'luck', 'speed', 'block', 'health', 'mana'].random(), a+'%')
  }

  if(me.character.includes('환각')) {
    getbuff(data.buff[random(data.buff.length)-1].id, 4)
  }

  heal(getstat('health_regen'))
  manaheal(getstat('mana_regen'))
  
  // situation
  var situdata = getdata(data.situation, game.situation);
  if(typeof situdata.func == 'function') {
    situdata.func()
  } else {
    getdata(data.situation, situdata.func).func()
  }
  make_choice(make_list(situdata.choice, 'id'))
  
  for(var i = 0; i<Object.keys(me.stat).length; i++) {
    me.stat[Object.keys(me.stat)[i]].extra = 0; me.stat[Object.keys(me.stat)[i]].extra_per = 0;
  }

  function applybuff(who) {
    for(var i = 0; i<who.buff.length; i++) {
      if(who.buff[i].hasOwnProperty('func')) {
        who.buff[i].func(who)
      }
      who.buff[i].times--
      if(who.buff[i].times == 0) {
        if(who.buff[i].hasOwnProperty('stat')) {
          var bsdt = who.buff[i].stat;
          for(var j = 0; j<Object.keys(bsdt).length; j++) {
            setstat(Object.keys(bsdt)[j], minus(bsdt[Object.keys(bsdt)[j]]), who)
          }
        }
        who.buff.splice(i, 1)
      }
    }
  }

  applybuff(me);
  if(enemy != null) {
    applybuff(enemy);
  }

  event_check(me, 'mainhand', 'func')
  event_check(me, 'offhand', 'func')
  event_check(me, 'neck', 'func')
  if(enemy != null) {
    event_check(enemy, 'mainhand', 'func')
    event_check(enemy, 'offhand', 'func')
    event_check(enemy, 'neck', 'func')
  }

  me.weapon_confusion -= me.weapon_confusion > 0 ? 4 : 0
  
  // if(me.weapon_confusion >= 100) {
  //   getbuff('무기 혼란', 1)
  // }

  tick()

  if(enemy) {
    for(var i = 0; i<Object.keys(enemy.stat).length; i++) {
      enemy.stat[Object.keys(enemy.stat)[i]].extra = 0; enemy.stat[Object.keys(enemy.stat)[i]].extra_per = 0;
    }
  }

  if(me.character.includes('분노조절장애')) {
    var bunnno_howget = (1 - me.health / getstat('health'))*100;
    setstat('attack', bunnno_howget+'%', me, true)
    setstat('def', (-bunnno_howget)+'%', me, true)
    setstat('reg', (-bunnno_howget)+'%', me, true)
  }

  if(getstat('curse')/200 > Math.random()) {
    switch(random(6)) {
      case 0 : enter('하늘에서 천둥이 떨어져 10의 피해를 받았다. #저주'); me.health -= 10; break;
      case 1 : enter('갑옷이 부서졌다. #저주'); getbuff('방패 부서짐', 8); break;
      case 2 : enter('상처가 아물지 않는다. #저주'); getbuff('깊은 상처', 12); break;
      case 3 : enter('무기력해졌습니다. #저주'); getbuff('무기력', 2); break;
      case 4 : enter('영구적으로 공격력이 감소했습니다. #저주'); setstat('attack', '-5%'); break;
      case 5 : enter('영구적으로 주문력이 감소했습니다. #저주'); setstat('spell', '-5%'); break;
      case 6 : enter('아이템의 얻을 확률이 낮아집니다. #저주'); getbuff('아이템의 저주', 18); break;
    }
  }

  for(var i = 0; i < Object.keys(info); i++) {
    info[i] = false;
  }
}

function tick() {
  // health and mana bar reload
  if(make_list(me.buff).includes('무감각')) {
    $('.info .health-bar').css('width', '160px')
    $('.info .health-bar').css('background', 'gray')
  } else {
    $('.info .health-bar').css('width', (160 * me.health / getstat('health')) +'px')
    $('.info .health-bar').css('background', '#da9eb2')
  }
  if(make_list(me.buff).includes('진짜 시력 저하')) {
    $('body').css('filter', 'blur(4px)')
  } else {
    $('body').css('filter', '')
  }
  if(make_list(me.buff).includes('울렁증')) {
    $('body').css('transform', 'rotate'+['X','Y','Z'].random()+'(180deg)')
  } else {
    $('body').css('transform', 'none')
  }
  $('.info .mana-bar').css('width', (160 * me.mana / getstat('mana')) +'px')
  $('.exp').css('width', (me.exp / ((me.level-1) * 20 + 60))*100 +'%')

  for(var i = 0; i < $('.stat-table tr').length; i++) {
    $($('.stat-table tr')[i]).children('.amount').text(getstat($($('.stat-table tr')[i]).attr('class')))
  }

  $('.info .gold').text(Math.floor(me.gold))

  // inventory
  var inven_text = '';
  inven_text += '<p class=equip id=mainhand>' + me.equip.mainhand.id + (((me.equip.mainhand.upgrade != 0) && (me.equip.mainhand.upgrade != null)) ? ' +'+(me.equip.mainhand.upgrade) : '') + ' (오른손)</p>'
  inven_text += '<p class=equip id=offhand>' + me.equip.offhand.id + (((me.equip.offhand.upgrade != 0) && (me.equip.offhand.upgrade != null)) ? ' +'+(me.equip.offhand.upgrade) : '') + ' (왼손)</p>'
  inven_text += '<p class=equip id=neck>' + me.equip.neck.id + (((me.equip.neck.upgrade != 0) && (me.equip.neck.upgrade != null)) ? ' +'+(me.equip.neck.upgrade) : '') + ' (장신구)</p>'
  for(var i = 0; i<me.inventory.length; i++) {
    if((me.inventory[i].how == 1) || (me.inventory[i].how == undefined)) {
      inven_text += '<p id='+i+'>' + me.inventory[i].id + '</p>'
    } else {
      inven_text += '<p id='+i+'>' + me.inventory[i].id + ' (' + me.inventory[i].how + ')</p>'
    }
  }

  if(me.health > getstat('health')) me.health = getstat('health')
  if(me.mana > getstat('mana')) me.mana = getstat('mana')

  $('.inventory').html(inven_text)

  $('.equip').on('mouseup', function (event) {
    if ((event.button == 2) || (event.which == 3) && !right_click_on) {
      var item_window = $('.right-setting')
      right_click_on = true;
      item_window.html('')
      
      var item = me.equip[$(this).attr('id')]

      var can_upgrade = false;
      for(let i = 0; i<me.inventory.length; i++) {
        if(getdata(data.item, me.inventory[i].id).tag.includes('upgrade')) {
          can_upgrade = true;
        }
      }

      if(can_upgrade && $(this).attr('id') == 'offhand') {
        console.log($(this).attr('id'))
        var item_window_upgrade = $('<p>강화하기</p>')
        item_window.append(item_window_upgrade)
        item_window_upgrade.on('click', function () {
          getitem('숯돌', -1)
          me.equip.offhand = upgrade(me.equip.offhand);
        })
      }

      var item_window_swap = $('<p>스왑하기</p>')
      item_window.append(item_window_swap)
      var tthis = this;
      item_window_swap.on('click', function () {
        if($(tthis).attr('id') == 'mainhand') {
          equip('mainhand', getdata(data.item, '아무것도 없음'))
          equip('offhand', me.inventory.length-1)
          equip('mainhand', me.inventory.length-1)
        } else if($(tthis).attr('id') == 'offhand') {
          equip('offhand', getdata(data.item, '아무것도 없음'))
          equip('mainhand', me.inventory.length-1)
          equip('offhand', me.inventory.length-1)
        } else if($(tthis).attr('id') == 'neck') {
          equip('neck', getdata(data.item, '아무것도 없음'))
          equip('offhand', me.inventory.length-1)
          equip('neck', me.inventory.length-1)
        }
      })
      
      item_window.css('left', event.pageX+'px')
      item_window.css('top', event.pageY+'px')
      item_window.css('display', 'block')
    } else {
      equip($(this).attr('id'), getdata(data.item, '아무것도 없음'))
    }
    tick()
  })

  $('.equip').on('mousemove', function () {
    var stat_text = '';
    var itemdata = getdata(data.item, me.equip[$(this).attr('id')].id)
    if($(this).attr('id') == 'mainhand') {
      for(var i = 0; i<Object.keys(itemdata.stat).length; i++) {
        stat_text += '<br />'+Object.keys(itemdata.stat)[i]+': '+itemdata.stat[Object.keys(itemdata.stat)[i]] + ' + 25%(='+(Number(itemdata.stat[Object.keys(itemdata.stat)[i]])*0.25)+')'
      }
    } else if($(this).attr('id') == 'offhand'){
      for(var i = 0; i<Object.keys(itemdata.stat).length; i++) {
        stat_text += '<br />'+Object.keys(itemdata.stat)[i]+': '+itemdata.stat[Object.keys(itemdata.stat)[i]]
      }
      if(itemdata.hasOwnProperty('durability')) {
        stat_text += '<br />내구도: '+itemdata.durability;
      }
      if(itemdata.hasOwnProperty('firmness')) {
        stat_text += '<br />견고: '+itemdata.firmness;
      }
    } else {
      for(var i = 0; i<Object.keys(itemdata.stat).length; i++) {
        stat_text += '<br />'+Object.keys(itemdata.stat)[i]+': '+itemdata.stat[Object.keys(itemdata.stat)[i]]
      }
    }
    caption(itemdata.des+stat_text)
    tick()
  })

  $('.inventory p:not(.equip)').on('mousemove', function () {
    caption(getdata(data.item, me.inventory[Number($(this).attr('id'))].id).des)
    tick()
  })

  $('.inventory p:not(.equip)').on('mouseup', function (event) {
    var item = me.inventory[Number($(this).attr('id'))]
    var itemdata = getdata(data.item, item.id)
    if ((event.button == 2) || (event.which == 3) && !right_click_on) {
      var item_window = $('.right-setting')
      right_click_on = true
      item_window.html('')

      if(!itemdata.tag.includes('weapon')) {
        if(item.how >= 1) {
          var item_window_throw_one = $('<p>한개 버리기</p>')
          item_window.append(item_window_throw_one)
          item_window_throw_one.on('click', function () {
            getitem(item.id, -1)
          })
        }
        if(item.how >= 11) {
          var item_window_throw_ten = $('<p>열개 버리기</p>')
          item_window.append(item_window_throw_ten)
          item_window_throw_ten.on('click', function () {
            getitem(item.id, -10)
          })
        }
        if(item.how >= 101) {
          var item_window_throw_hdrd = $('<p>백개 버리기</p>')
          item_window.append(item_window_throw_hdrd)
          item_window_throw_hdrd.on('click', function () {
            getitem(item.id, -100)
          })
        }
        var item_window_throw_all = $('<p>모두 버리기</p>')
        item_window.append(item_window_throw_all)
        var tthis = this;
        item_window_throw_all.on('click', function () {
          me.inventory.splice(Number($(tthis).attr('id')), 1)
          tick()
        })
      } else {
        var gold = (item.upgrade+1)*10
        var item_window_sell = $('<p>판매하기 ('+gold+')</p>')
      }
      item_window.css('left', event.pageX+'px')
      item_window.css('top', event.pageY+'px')
      item_window.css('display', 'block')
    }
  })

  $('.inventory p:not(.equip)').on('click', function () {
    var itemnum = Number($(this).attr('id'));
    var itemdata = getdata(data.item, me.inventory[itemnum].id)
    if(itemdata.tag.includes('weapon')) {
      if(me.equip.mainhand.id == '아무것도 없음') {
        equip('mainhand', itemnum)
      } else if(me.equip.offhand.id == '아무것도 없음') {
        equip('offhand', itemnum)
      } else if(me.equip.neck.id == '아무것도 없음') {
        equip('neck', itemnum)
      }
    } else if(itemdata.hasOwnProperty('func')) {
      itemdata.func(me)
      if(itemdata.tag.includes('potion') || itemdata.tag.includes('paper'))
      getitem(me.inventory[itemnum].id, -1)
    }
    tick()
  })

  $('.info .buff').html('')

  for(var i = 0; i<me.buff.length; i++) {
    var buff_icon = $('<div class=icon></div>')
    if(me.buff[i].tag.includes('debuff')) {
      buff_icon.css('background', '#da9eb2')
    } else if(me.buff[i].tag.includes('buff')) {
      buff_icon.css('background', '#a4a2d2')
    }
    // buff_icon.on('mousemove', function () {
    //   caption(me.buff[i-1].des + '<br />[' + me.buff[i-1].times +'턴 남음]')
    // })

    buff_icon.attr('onmousemove', "caption('<p class=bold>'+me.buff["+i+"].id+'</p>'+me.buff["+i+"].des + '<br />[' + me.buff["+i+"].times +'턴 남음]')")
    $('.info .buff').append(buff_icon)
  }
}

$(document).on('click', function () {
  if(right_click_on) {
    right_click_on = false;
    $('.right-setting').css('display', 'none')
  }
})

function make_list(arr, fil='id') {
  var list = [];
  for(let i = 0; i < arr.length; i++) {
    if(!arr[i].hasOwnProperty('conditions')) {
      list.push(arr[i][fil])
    } else if(arr[i].conditions()) {
      list.push(arr[i][fil])
    }
  }
  return list;
}
