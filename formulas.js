// 製剤定義
const formulas = {
  peptamenAF: { name: "ペプタメンAF", kcalPerMl: 1.5, proteinPerMl: 0.095,fatPerMl:0.066, type: "rate", naPerMl: 2.63, kPerMl: 2.32 , naEqPerMl: 0, kEqPerMl: 0
      },
  terumeal2_0a: { name: "テルミール2.0α", kcalPerMl: 2.0,fatPerMl:0.075,proteinPerMl: 0.0725, type: "rate", naPerMl: 1, kPerMl: 1, naEqPerMl: 0, kEqPerMl: 0
      },
  recoverymini: { name: "リカバリーmini", kcalPerMl: 1.6,fatPerMl:0.06,proteinPerMl: 0.064, type: "rate", naPerMl: 230/125, kPerMl: 180/125, naEqPerMl: 0, kEqPerMl: 0
      },
  hinexre: { name: "ハイネックスリニュート", kcalPerMl: 1,fatPerMl: 22.4/400, proteinPerMl: 24/400, type: "rate", naPerMl: 1.59, kPerMl: 1, naEqPerMl: 0, kEqPerMl: 0
      },
  renalmp: {name: "リーナレンMP", kcalPerMl: 200 / 125, proteinPerMl: 7.0 / 125, fatPerMl: 5.6 / 125,type: "rate",naPerMl: 120/125, kPerMl: 60 / 125,naEqPerMl:0,  kEqPerMl:0
      },
　enelvo: { name: "エネーボ", kcalPerMl: 300/250, fatPerMl:9.6/250, proteinPerMl: 13.5/250, type: "rate", naPerMl: 230/250, kPerMl: 300/250, naEqPerMl: 0, kEqPerMl: 0, memo:"医薬品"
      },
  CZ_Hi: { name: "CZ_Hi", kcalPerMl: 1.0,fatPerMl:0.022,proteinPerMl: 0.05, type: "rate", naPerMl: 0.9, kPerMl: 1.5, naEqPerMl: 0, kEqPerMl: 0
      },
  mainbalance: { name: "メイン", kcalPerMl: 1,fatPerMl:0.028,proteinPerMl: 0.05, type: "rate", naPerMl: 0.7, kPerMl: 0.8, naEqPerMl: 0, kEqPerMl: 0
      },
  ELENTAL: { name: "エレンタール80g/300mL", kcalPerMl: 300/300, fatPerMl:0.51/300, proteinPerMl: 14.1/300, type: "rate", naPerMl: 260/300, kPerMl: 217.6/300, naEqPerMl: 0, kEqPerMl: 0
      },
  marmedone: { name: "マーメッドワン", kcalPerMl: 300/300, fatPerMl:11.4/300, proteinPerMl: 12/300, type: "rate", naPerMl: 420/300, kPerMl: 495/300, naEqPerMl:0, kEqPerMl: 0
      },
  renawell: { name: "レナウェル3", kcalPerMl: 200/125, fatPerMl:8.9/125, proteinPerMl: 3/125, type: "rate", naPerMl: 60/125, kPerMl: 20/125, naEqPerMl: 0, kEqPerMl: 0
      },
  elneopaNF1: { name: "エルネオパNF1", kcalPerMl: 0.56,fatPerMl:0, proteinPerMl: 0.02, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 0.05, kEqPerMl: 0.022
      },
  elneopaNF2: { name: "エルネオパNF2", kcalPerMl: 0.82,fatPerMl:0, proteinPerMl: 0.03, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 0.05, kEqPerMl: 0.027
      },
  kidoparen: { name: "キドパレン", kcalPerMl: 1500/1050, fatPerMl:0, proteinPerMl: 32.847/1050, type: "rate", naPerMl: 0, kPerMl: 0 , naEqPerMl: 50/1050, kEqPerMl: 0, memo: "微量元素が入ってない"
      },
  hullcalic: { name: "フルカリック3", kcalPerMl: 1160/1103, fatPerMl:0, proteinPerMl: 40/1103, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl:50/1103, kEqPerMl: 30/1103
      },
　highcalic: { name: "ハイカリックRF", kcalPerMl: 2,fatPerMl:0, proteinPerMl: 0, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 25/500, kEqPerMl: 0
      }, 
  highcalicamiparen: { name: "HA", kcalPerMl: 580/450,fatPerMl:0, proteinPerMl: 20/450, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 12.9/450, kEqPerMl: 0, memo:"ハイカリックRF250,アミパレン200"
      }, 
  highcalic2amiparen: { name: "H2A", kcalPerMl: 660/650,fatPerMl:0, proteinPerMl: 40/650, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 13.3/650, kEqPerMl: 0, memo:"ハイカリックRF250,アミパレン400"
      }, 
  highcalic3amiparen: { name: "H3A", kcalPerMl: 740/850,fatPerMl:0, proteinPerMl: 60/850, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 13.7/850, kEqPerMl: 0, memo:"ハイカリックRF250,アミパレン600"
      }, 
　bfluid: { name: "ビーフリード", kcalPerUnit: 210, fatPerUnit:0, proteinPerUnit: 15, type: "count", waterPerUnit: 500, naPerUnit: 0, kPerUnit: 0, naEqPerUnit: 17.5, kEqPerUnit: 10,memo: "同一パックで８時間以上の持続点滴や他剤混注は菌血症リスクのため非推奨"
      },
　amiparen200: { name: "アミパレン200", kcalPerUnit: 80,fatPerUnit:0, proteinPerUnit: 20, waterPerUnit: 200, type: "count", naPerUnit: 0, kPerUnit: 0, naEqPerUnit: 0.4,　kEqPerUnit: 0
      },
　kidmine: { name: "キドミン200", kcalPerUnit: 14.41*4, fatPerUnit:0, proteinPerUnit: 14.41,　waterPerUnit: 200, type: "count", naPerMl: 0, kPerMl: 0, naEqPerUnit:0.4, kEqPerUnit: 0
      },
　aminoleban: { name: "アミノレバン500", kcalPerUnit: 39.93*4, fatPerUnit:0, proteinPerUnit: 39.93, type: "count", naPerUnit: 0, kPerMl: 0, naEqPerMl:7, kEqPerMl:0, waterPerUnit: 500
      },
  Intralipid: { name: "イントラリポス20%100mL", kcalPerUnit: 200, fatPerUnit:200/9, proteinPerUnit: 0, type: "count", naPerMl: 0, kPerUnit: 0, naEqPerUnit: 0, kEqPerUnit: 0, waterPerUnit:100
      },
  soldem1: { name: "ソルデム1", kcalPerMl: 52/500,fatPerMl:0, proteinPerMl: 0, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 45/500, kEqPerMl: 0
      },
  soldem3: { name: "ソルデム3", kcalPerMl: 0.108,fatPerMl:0, proteinPerMl: 0, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 0.05, kEqPerMl: 0.02
      },
  soldem3A: { name: "ソルデム3A", kcalPerMl: 0.172, fatPerMl:0,proteinPerMl: 0, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 0.035, kEqPerMl: 0.02
      },
  soldem3AG: { name: "ソルデム3AG", kcalPerMl: 0.3, fatPerMl:0,proteinPerMl: 0, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 0.035, kEqPerMl: 0.02
      },
　solacetf: { name: "ソルアセトF", kcalPerMl: 0,fatPerMl:0, proteinPerMl: 0, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 0.131, kEqPerMl: 0.004
      },
　normalsaline: { name: "生理食塩水", kcalPerMl: 0, fatPerMl:0, proteinPerMl: 0, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 0.154, kEqPerMl: 0.154
      },
　D5W: { name: "5%ブドウ糖液", kcalPerMl: 50/250, fatPerMl:0, proteinPerMl: 0, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 0, kEqPerMl: 0
      },
  D10W: { name: "10%ブドウ糖液", kcalPerMl: 200/500, fatPerMl:0, proteinPerMl: 0, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 0, kEqPerMl: 0
      },
  meylon: { name: "メイロン8.4%10mL", kcalPerMl: 0, fatPerMl:0, proteinPerMl: 0, type: "rate", naPerMl: 0, kPerMl: 0, naEqPerMl: 1, kEqPerMl: 0, memo:"必要量（mEq）＝不足塩基量（mEq/L）×0.2×体重（kg）"
      },
　agarori: { name: "アガロリーゼリー", kcalPerUnit: 150,fatPerUnit:0, proteinPerUnit: 0, waterPerUnit: 83, type: "count", naPerUnit: 0, kPerUnit: 0, naEqPerUnit: 0.4,　kEqPerUnit: 0
      },
  propofol: { name: "プロポフォール", kcalPerMl: 1.1, proteinPerMl: 0,fatPerMl:1.1/9, type: "rate", naPerMl: 0, kPerMl: 0 , naEqPerMl: 0, kEqPerMl: 0
      },
}

const sectionTitles = {
  0: "-EN、たんぱく質量順-",
  11: "-カロリー輸液-",
  20: "-タンパク質-",
  23: "-脂質-",
  24: "-その他-",
};

const quickList = ["peptamenAF",　"recoverymini", "hinexre",　"renalmp",  "renawell",  "propofol"];
