/* Ignem custodimus — boutique du colombier
 * SVG autonomes : décor 3:2 et portraits indépendants.
 */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var palette = { nuit:'#17110d', four:'#221912', pierre:'#3b2d22', calcaire:'#ecdfc4', cuivre:'#d27b3e', braise:'#f3b04a', houblon:'#9cc95e' };
  function svg(viewBox, body, label) {
    return '<svg xmlns="' + NS + '" viewBox="' + viewBox + '" role="img" aria-label="' + label + '">' + body + '</svg>';
  }
  function boutique() {
    var bottles = '';
    var colors = ['#526b48','#a65d2f','#3f665c','#8c4a29','#597448','#536e4b','#9b5a32','#3d655a','#a45e35','#617a4b'];
    [0,1,2,3,4,5,6,7,8,9].forEach(function(i) {
      var x = 88 + i * 86, y = i < 5 ? 128 + (i%2)*7 : 265 + (i%2)*5;
      bottles += '<g transform="translate('+x+' '+y+')"><path d="M-10 0h20v-12h-6v-17h-8v17h-6z" fill="'+colors[i]+'" stroke="#24170f" stroke-width="4"/><rect x="-10" y="-5" width="20" height="5" fill="#d8b77e"/><rect x="-5" y="-25" width="10" height="6" fill="#c9a26b"/></g>';
    });
    [0,1,2,3,4,5,6,7,8,9].forEach(function(i) {
      var x = 88 + i * 86, y = 270 + (i%2)*4;
      if (i < 5) return;
      bottles += '<g transform="translate('+x+' '+y+')"><path d="M-9 0h18v-11h-5v-16h-8v16h-5z" fill="'+colors[9-i]+'" stroke="#24170f" stroke-width="4"/><rect x="-9" y="-4" width="18" height="4" fill="#d8b77e"/></g>';
    });
    var stripes = '';
    for (var i=0;i<10;i++) stripes += '<path d="M'+(180+i*60)+' 350h30l-26 60h-30z" fill="'+(i%2?'#a84732':'#f3dfb9')+'"/>';
    return svg('0 0 960 640',
      '<defs><linearGradient id="stone" x2="0" y2="1"><stop stop-color="#8d7154"/><stop offset="1" stop-color="#4b3829"/></linearGradient><linearGradient id="wood" x2="0" y2="1"><stop stop-color="#a56d3d"/><stop offset="1" stop-color="#56351f"/></linearGradient><pattern id="blocks" width="180" height="90" patternUnits="userSpaceOnUse"><path d="M0 1H180M0 45H180M50 1V45M130 45V90" stroke="#302319" stroke-width="5" opacity=".45"/></pattern><pattern id="floor" width="120" height="70" patternUnits="userSpaceOnUse"><path d="M0 0H120M0 35H120M60 0V35M20 35V70" stroke="#2d2018" stroke-width="3" opacity=".35" fill="none"/></pattern></defs>'+
      '<rect width="960" height="640" fill="#211810"/><rect width="960" height="510" fill="url(#stone)"/><rect width="960" height="510" fill="url(#blocks)"/>'+
      '<path d="M0 0H960V510H0Z" fill="none" stroke="#1b120d" stroke-width="22"/>'+
      '<path d="M270 0V125Q270 32 480 32Q690 32 690 125V0Z" fill="#2c2018"/><path d="M310 0V116Q310 55 480 55Q650 55 650 116V0" fill="none" stroke="#a88a68" stroke-width="13" opacity=".4"/>'+
      '<g fill="#21170f" stroke="#a88a68" stroke-width="8"><path d="M72 95Q72 48 120 48Q168 48 168 95V154H72Z"/><path d="M790 95Q790 48 838 48Q886 48 886 95V154H790Z"/><path d="M72 235Q72 188 120 188Q168 188 168 235V294H72Z"/><path d="M790 235Q790 188 838 188Q886 188 886 235V294H790Z"/></g>'+
      '<g stroke="#2a211b" stroke-width="5"><g transform="translate(110 80)"><ellipse rx="25" ry="17" fill="#b7b2a7"/><circle cx="20" cy="-15" r="12" fill="#d4cfc1"/><path d="M29 -17l16 5-15 5" fill="#d27b3e"/><path d="M-9 0q15-22 22 4q-16 14-22-4" fill="#777e7a"/></g><g transform="translate(840 77) scale(-1 1)"><ellipse rx="25" ry="17" fill="#8f9996"/><circle cx="20" cy="-15" r="12" fill="#c4c9c0"/><path d="M29 -17l16 5-15 5" fill="#d27b3e"/></g></g>'+
      '<rect y="470" width="960" height="170" fill="#694b32"/><rect y="470" width="960" height="170" fill="url(#floor)"/>'+
      '<path d="M65 178H310V193H65ZM650 178H895V193H650ZM65 320H310V335H65ZM650 320H895V335H650Z" fill="#39251a" stroke="#21150e" stroke-width="8"/>'+bottles+
      '<path d="M60 194H315M645 194H900M60 336H315M645 336H900" stroke="#b17a4c" stroke-width="4"/>'+
      '<circle cx="480" cy="142" r="66" fill="#261b14" stroke="#b18c64" stroke-width="13"/><circle cx="480" cy="142" r="53" fill="#a8c3c5"/><path d="M427 142H533M480 89V195" stroke="#6d4d33" stroke-width="9"/><path d="M430 166Q480 122 530 166V190H430Z" fill="#75845a"/>'+
      '<path d="M180 350H780L754 410H206Z" fill="#f0dfbd" stroke="#2a1b12" stroke-width="9"/>'+stripes+'<path d="M180 350H780" stroke="#3a2418" stroke-width="12"/>'+
      '<ellipse cx="480" cy="590" rx="370" ry="30" fill="#1b120d" opacity=".45"/><path d="M115 444H845V594H115Z" fill="url(#wood)" stroke="#29190f" stroke-width="12"/><path d="M115 444H845V472H115Z" fill="#c18a52" stroke="#392316" stroke-width="7"/><path d="M145 485H815V578H145Z" fill="#704326" stroke="#3b2417" stroke-width="6"/>'+
      '<g transform="translate(190 416)"><rect x="-43" y="0" width="86" height="28" rx="5" fill="#b9a58a" stroke="#342319" stroke-width="6"/><path d="M-25 0L0 -32L25 0" fill="none" stroke="#5d4c3b" stroke-width="6"/></g>'+
      '<g transform="translate(730 414)"><rect x="-42" y="-35" width="84" height="68" rx="5" fill="#d7c5a4" stroke="#342319" stroke-width="6"/><rect x="-30" y="-24" width="60" height="18" fill="#30372a"/><path d="M-23 12H23M-23 22H8" stroke="#6d5a43" stroke-width="5"/></g>'+
      '<g transform="translate(500 427)"><path d="M-50 0H50L42 36H-42Z" fill="#8a4f2b" stroke="#3a2417" stroke-width="6"/><circle cx="-20" cy="-7" r="14" fill="#9b4932"/><circle cx="12" cy="-8" r="15" fill="#c38b42"/><circle cx="33" cy="-5" r="12" fill="#7f8d4b"/></g>'+
      '<g transform="translate(480 245)"><path d="M-145 -30H145V34H-145Z" fill="#39251a" stroke="#d0b28a" stroke-width="7"/><text x="0" y="1" text-anchor="middle" fill="#f3dfbd" font-family="Georgia,serif" font-size="25" font-weight="bold" letter-spacing="3">LE COLOMBIER</text><text x="0" y="23" text-anchor="middle" fill="#f3b04a" font-family="Georgia,serif" font-size="13" letter-spacing="4">BOUTIQUE DU DOMAINE</text></g>'+
      '<g transform="translate(70 395)"><path d="M0 45q-12-42 10-54q18 20 4 54M10 45q2-34 27-40q9 25-27 40" fill="#667d49" stroke="#2d3c24" stroke-width="4"/><path d="M-8 45h48l-7 22H0Z" fill="#a65e36" stroke="#3b2417" stroke-width="5"/></g>'+
      '<rect x="8" y="8" width="944" height="624" fill="none" stroke="#17110d" stroke-width="16"/>',
      'Boutique rustique du domaine dans un pigeonnier en pierre du Quercy');
  }
  var people = [
    {id:'paysan',name:'Le paysan',skin:'#d9a77f',hair:'#5b3928',beard:'#68412c',coat:'#526344',shirt:'#e8d8b9',hat:'wide'},
    {id:'herboriste',name:'L’herboriste',skin:'#e7bd98',hair:'#9b633c',coat:'#8a9a62',shirt:'#f1dfbf',flower:true},
    {id:'tonnelier',name:'Le tonnelier',skin:'#bd805d',hair:'#38251c',beard:'#38251c',coat:'#805038',shirt:'#d7c4a0',hat:'cap'},
    {id:'marchande',name:'La marchande',skin:'#f0c6a0',hair:'#a54c35',coat:'#9a5540',shirt:'#f4e5cb',ribbon:true},
    {id:'voyageur',name:'Le voyageur',skin:'#d7a47d',hair:'#6d5541',beard:'#8a674d',coat:'#536c78',shirt:'#e8d9c2',scarf:true},
    {id:'apicultrice',name:'L’apicultrice',skin:'#e6b68f',hair:'#4c3328',coat:'#b17b32',shirt:'#f4e3c2',veil:true},
    {id:'distillateur',name:'Le distillateur',skin:'#c98f6b',hair:'#d0c0a3',beard:'#a99b83',coat:'#48564b',shirt:'#e9dfca',glasses:true}
  ];
  function drawPortrait(p) {
    var extras = '';
    if (p.hat==='wide') extras += '<path d="M35 61Q100 3 165 61L154 75H45Z" fill="#795331" stroke="#3b281b" stroke-width="6"/><path d="M53 55Q100 31 148 55" stroke="#d2a05d" stroke-width="8" fill="none"/>';
    if (p.hat==='cap') extras += '<path d="M45 61Q53 20 102 24Q146 23 154 60L180 71H47Z" fill="#6e4430" stroke="#352319" stroke-width="6"/>';
    if (p.flower) extras += '<g transform="translate(143 53)" fill="#e8a0a0" stroke="#6c473b" stroke-width="2"><circle r="8"/><circle cy="-10" r="7"/><circle cx="10" r="7"/><circle cy="10" r="7"/><circle cx="-10" r="7"/><circle r="4" fill="#f3d36b"/></g>';
    if (p.ribbon) extras += '<path d="M58 47Q100 10 142 47L157 30L153 65Q100 50 47 65Z" fill="#d27b3e" stroke="#552a21" stroke-width="4"/>';
    if (p.scarf) extras += '<path d="M57 145Q100 169 143 145L155 194H47Z" fill="#bd6045" stroke="#4a3027" stroke-width="5"/>';
    if (p.veil) extras += '<path d="M45 53Q100 2 155 53L164 151Q130 177 100 165Q70 177 36 151Z" fill="#d7c79b" opacity=".45" stroke="#e8dfc5" stroke-width="4"/>';
    if (p.glasses) extras += '<g fill="none" stroke="#4b3427" stroke-width="5"><rect x="57" y="91" width="37" height="24" rx="10"/><rect x="106" y="91" width="37" height="24" rx="10"/><path d="M94 101h12M56 99l-12-5M144 99l12-5"/></g>';
    var beard = p.beard ? '<path d="M57 117Q58 159 100 165Q142 159 143 117Q137 150 100 145Q63 150 57 117Z" fill="'+p.beard+'" stroke="#39271f" stroke-width="4"/>' : '';
    return svg('0 0 200 210',
      '<ellipse cx="100" cy="196" rx="77" ry="10" fill="#1b120d" opacity=".2"/>'+
      '<path d="M30 205Q31 152 69 145H131Q169 152 170 205Z" fill="'+p.coat+'" stroke="#34241a" stroke-width="6"/>'+
      '<path d="M78 147L100 173L122 147L111 205H89Z" fill="'+p.shirt+'" stroke="#34241a" stroke-width="4"/>'+
      '<path d="M52 89Q48 39 100 36Q152 39 148 89L141 128Q132 153 100 156Q68 153 59 128Z" fill="'+p.skin+'" stroke="#3d291f" stroke-width="5"/>'+
      '<path d="M47 91Q42 29 100 27Q158 27 153 91L143 71Q126 53 100 56Q72 54 56 75Z" fill="'+p.hair+'" stroke="#38251c" stroke-width="5"/>'+extras+
      '<ellipse cx="81" cy="103" rx="6" ry="8" fill="#39271f"/><ellipse cx="120" cy="103" rx="6" ry="8" fill="#39271f"/><circle cx="83" cy="100" r="2" fill="#fff4dd"/><circle cx="122" cy="100" r="2" fill="#fff4dd"/>'+
      '<path d="M96 109Q91 124 101 126M83 135Q100 146 117 135" fill="none" stroke="#874b3b" stroke-width="4" stroke-linecap="round"/>'+
      '<ellipse cx="60" cy="119" rx="8" ry="5" fill="#d77e70" opacity=".45"/><ellipse cx="140" cy="119" rx="8" ry="5" fill="#d77e70" opacity=".45"/>'+beard,
      'Portrait chibi de '+p.name);
  }
  var api = {
    palette: Object.freeze(palette),
    boutique: Object.freeze({decor:boutique}),
    portraits: Object.freeze(people.map(function(p){return Object.freeze({id:p.id,name:p.name,svg:function(){return drawPortrait(p);}});})),
    portrait: function(id){var p=people.find(function(x){return x.id===id;});return p?drawPortrait(p):null;}
  };
  window.IgnemVisuels = window.IgnemVisuels || {};
  window.IgnemVisuels.boutique = Object.freeze(api);
}());
