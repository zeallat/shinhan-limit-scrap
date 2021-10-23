import * as puppeteer from 'puppeteer';

// @ts-ignore
const KEYMAPS = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "소문자 q": "q",
  "소문자 w": "w",
  "소문자 e": "e",
  "소문자 r": "r",
  "소문자 t": "t",
  "소문자 y": "y",
  "소문자 u": "u",
  "소문자 i": "i",
  "소문자 o": "o",
  "소문자 p": "p",
  "소문자 a": "a",
  "소문자 s": "s",
  "소문자 d": "d",
  "소문자 f": "f",
  "소문자 g": "g",
  "소문자 h": "h",
  "소문자 j": "j",
  "소문자 k": "k",
  "소문자 l": "l",
  "소문자 z": "z",
  "소문자 x": "x",
  "소문자 c": "c",
  "소문자 v": "v",
  "소문자 b": "b",
  "소문자 n": "n",
  "소문자 m": "m",
  "확인": "ok",
  "대문자 Q": "Q",
  "대문자 W": "W",
  "대문자 E": "E",
  "대문자 R": "R",
  "대문자 T": "T",
  "대문자 Y": "Y",
  "대문자 U": "U",
  "대문자 I": "I",
  "대문자 O": "O",
  "대문자 P": "P",
  "대문자 A": "A",
  "대문자 S": "S",
  "대문자 D": "D",
  "대문자 F": "F",
  "대문자 G": "G",
  "대문자 H": "H",
  "대문자 J": "J",
  "대문자 K": "K",
  "대문자 L": "L",
  "대문자 Z": "Z",
  "대문자 X": "X",
  "대문자 C": "C",
  "대문자 V": "V",
  "대문자 B": "B",
  "대문자 N": "N",
  "대문자 M": "M",
  "달러표시": "$",
  "우물표시": "#",
  "느낌표": "!",
  "골뱅이": "@",
  "앰퍼센드": "&",
  "별표": "*",
  "윗꺽쇠": "^",
  "소괄호닫기": ")",
  "퍼센트": "%",
  "소괄호열기": "(",
  "빼기표시": "-",
  "밑줄": "_",
  "같음표": "=",
  "더하기표시": "+",
  "역슬래시": "\\",
  "수직바": "|",
  "중괄호열기": "{",
  "중괄호닫기": "}",
  "대괄호열기": "[",
  "대괄호닫기": "]",
  "반쌍점": ";",
  "쌍점": ":",
  "작은따옴표": "'",
  "큰따옴표": "\"",
  "쉼표": ",",
  "마침표": ".",
  "거듭인용표열기": "<",
  "거듭인용표닫기": ">",
  "물결표시": "~",
  "강세표": "`",
  "빗금": "/",
  "물음표": "?",
  "공백": " ",

  "특수문자": "특수문자",
  "소문자": "소문자",
  "쉬프트": "쉬프트",
  // @ts-ignore
  "확인": "확인"
};
const KEY_ARRS = Object.entries(KEYMAPS);

export const scrap = async ({id,password}:{id:string; password:string;}) => {


  const PASSWORD_TUPLES = Array.from(password).reduce((charmap, char) => {
    // @ts-ignore
    charmap.push(KEY_ARRS.find(keymap => keymap[1] === char));
    return charmap;
  }, []);

  return await (async () => {
    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions'],
    });
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1');
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.goto('https://www.shinhancard.com/crp/CRP12000N/CRP12111PH.shc');

    await page.evaluate((myid, mypassword, passwordkeytuples) => {

        // var myid = MY_ID, mypassword = MY_PASSWORD, passwordkeytuples = PASSWORD_TUPLES;

        // @ts-ignore
        function triggerEvent(el, eventName) {
          var event = document.createEvent('HTMLEvents');
          event.initEvent(eventName, true, false);
          el.dispatchEvent(event);
        }

        // @ts-ignore
        document.querySelector('a[href="#userChkCon3"]').click();
        var memid = document.getElementById('memid3');
        // @ts-ignore
        memid.value = myid;
        var pwd3 = document.getElementById('pwd3');
        triggerEvent(pwd3, 'focus');

        // @ts-ignore
        var activeKeypad = Array.from(document.querySelectorAll('.nppfs-keypad')).find(el => el.style.display !== 'none');
        // @ts-ignore
        var lowers = activeKeypad.querySelector('.kpd-group.lower');
        // @ts-ignore
        var uppers = activeKeypad.querySelector('.kpd-group.upper');
        // @ts-ignore
        var specials = activeKeypad.querySelector('.kpd-group.special');
        var keymapDict = {
          lower: lowers,
          upper: uppers,
          special: specials
        };

        // @ts-ignore
        function getCharType(string) {
          if (/^[A-Z]*$/.test(string)) {
            return 'upper';
          }
          if (/^[a-z]*$/.test(string)) {
            return 'lower';
          }
          if (/^[0-9]*$/.test(string)) {
            return 'lower';
          }
          return 'special';
        }

        // @ts-ignore
        function getKeyImg(keypadEl, key, alt) {
          var type = getCharType(key);
          var kpdimgs = Array.from(keypadEl.querySelectorAll('.kpd-data'));
          // @ts-ignore
          return kpdimgs.find(el => el.alt === alt);
        }

        function getCurrentKeypad() {
          // @ts-ignore
          var [currentKeypad, keypadEl] = Object.entries(keymapDict).find(([type, el]) => el.style.display !== 'none');
          return {currentKeypad, keypadEl};
        }

        // @ts-ignore
        function triggerImg(img) {
          var event = document.createEvent('HTMLEvents');
          event.initEvent('touchstart', true, false);
          img.dispatchEvent(event);
        }

        // @ts-ignore
        function changeKeypad(type) {
          var {currentKeypad, keypadEl} = getCurrentKeypad();
          var img;
          if (currentKeypad === type) {
            return;
          }

          if (currentKeypad === 'lower') {
            if (type === 'upper') {
              // 소문자 -> 시프트 = 대문자
              img = getKeyImg(keypadEl, '쉬프트', '쉬프트');
            } else {
              img = getKeyImg(keypadEl, '특수문자', '특수문자');
            }
          } else if (currentKeypad === 'upper') {
            if (type === 'lower') {
              // 대문자 -> 시프트 = 소문자
              img = getKeyImg(keypadEl, '쉬프트', '쉬프트');
            } else {
              img = getKeyImg(keypadEl, '특수문자', '특수문자');
            }
          } else {
            // 특수 -> 시프트 = 소문자
            img = getKeyImg(keypadEl, '쉬프트', '쉬프트');
            if (type === 'upper') {
              // 특수 -> 대문자 = 소문자 -> 대문자
              triggerImg(img); // 소문자 처리 후
              changeKeypad('upper');
              return;
            }
          }
          triggerImg(img);
        }

        // @ts-ignore
        function inputKey(alt, key) {
          var type = getCharType(key);
          changeKeypad(type);
          var {keypadEl} = getCurrentKeypad();
          var img = getKeyImg(keypadEl, key, alt);
          triggerImg(img);
        }

        var ki = 0;
        var keylen = passwordkeytuples.length;

        console.log('wait password typing...');

        ;(function nextInput() {
          if (ki < keylen) {
            var [alt, key] = passwordkeytuples[ki];
            inputKey(alt, key);
            // console.log(alt, key);
            setTimeout(nextInput, 100);
            ki++;
            return;
          }
          // page.screenshot({path: 'screenshot1.png'});

          inputKey('확인', '확인');
          console.log('확인, 로그인');

          var loginButton = document.getElementById('loginU');
          console.log('login button exists?', loginButton);

          // @ts-ignore
          setTimeout(() => loginButton.click(), 1000);
        })();
      },
      id,
      password,
      PASSWORD_TUPLES
    );
    // await page.screenshot({path: 'screenshot2.png'});
    // await page.screenshot({path: 'screenshot3.png'});

    await page.waitFor(PASSWORD_TUPLES.length * 100 + 1000);
    // await page.screenshot({path: 'screenshot4.png'});

    console.log('wait 1sec page redirection...');
    await page.waitFor(1000);
    // await page.screenshot({path: 'screenshot5.png'});

    let pageUrl = page.url();

    console.log('currentUrl:', pageUrl);

    // https://www.shinhancard.com/crp/CRP12000N/CRP12111PH.shc
    await page.evaluate(() => {
      var back = document.getElementById('m_prev');
      back && back.click();
    });

    console.log('wait 1sec page redirection...');
    await page.waitFor(1000);

    pageUrl = page.url();

    if (pageUrl !== 'https://www.shinhancard.com/crp/CRP72000N/CRP72000PH00.shc') {
      console.log('url mismatch, try force navigate... currentUrl:', pageUrl);
      console.log('wait 2sec...');
      await page.goto('https://www.shinhancard.com/crp/CRP72000N/CRP72000PH00.shc');
      await page.waitFor(2000);
    }

    // await page.screenshot({path: 'screenshot.png'});
    await page.waitFor(2000);

    try {
     const result= await page.evaluate(() => {
        var period = document.querySelector('[data-bind-text="searchPeriodUeDsm"]');
        var amount = document.querySelector('[data-bind-text="ueDsmAmt"]');
        var remains = document.querySelector('[data-bind-text="totjanamt"]');

        console.log('=============================');
        // @ts-ignore
        console.log('기간', period.textContent);
        // @ts-ignore
        console.log('이용', amount.textContent);
        // @ts-ignore
        console.log('잔여한도', remains.textContent);
        console.log('=============================');

        return {
          period: period?.textContent??null,
          amount: amount?.textContent??null,
          remains: remains?.textContent??null,
        }
      });

    await browser.close();
     return result;

    } catch (e) {
      console.log('실패');
      console.error(e);
    await browser.close();
      return null;
    }

  })();
}
