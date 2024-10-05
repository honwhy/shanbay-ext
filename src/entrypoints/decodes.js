/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
/** 解析每日需要复习单词接口返回的加密字符串。从源码里扒出来的  */
export function decodeDailyTaskResponse(encryptedString) {
  const re_btou = new RegExp(['[À-ß][-¿]', '[à-ï][-¿]{2}', '[ð-÷][-¿]{3}'].join('|'), 'g')
  const fromCharCode = String.fromCharCode
  const cb_btou = function (t) {
    switch (t.length) {
      case 4:
        const e
            = (((7 & t.charCodeAt(0)) << 18)
              | ((63 & t.charCodeAt(1)) << 12)
              | ((63 & t.charCodeAt(2)) << 6)
              | (63 & t.charCodeAt(3)))
              - 65536
        return (
          fromCharCode(55296 + (e >>> 10)) + fromCharCode(56320 + (1023 & e))
        )
      case 3:
        return fromCharCode(
          ((15 & t.charCodeAt(0)) << 12)
          | ((63 & t.charCodeAt(1)) << 6)
          | (63 & t.charCodeAt(2)),
        )
      default:
        return fromCharCode(
          ((31 & t.charCodeAt(0)) << 6) | (63 & t.charCodeAt(1)),
        )
    }
  }
  const btou = t => t.replace(re_btou, cb_btou)
  const _decode = t => btou(atob(t))
  const checkVersionI = (string) => {
    const e = string.charCodeAt()
    return e >= 65 ? e - 65 : e - 65 + 41
  }
  const checkVersion = string =>
    ((32 * checkVersionI(string[0]) + checkVersionI(string[1]))
      * checkVersionI(string[2])
      + checkVersionI(string[3]))
      % 32
      <= 1
  const decode = string =>
    _decode(
      String(string)
        .replace(/[-_]/g, (t) => {
          return t == '-' ? '+' : '/'
        })
        .replace(/[^A-Z0-9+/]/gi, ''),
    )

  class f {
    _char = '.'
    _children = {}

    getChar() {
      return this._char
    }

    getChildren() {
      return this._children
    }

    setChar(t) {
      this._char = t
    }

    setChildren(t, e) {
      this._children[t] = e
    }
  }

  class m {
    static and(t, e) {
      return this.get(this.get(t) & this.get(e))
    }

    static get(t) {
      return t >>> 0
    }

    static mod(t, e) {
      return this.get(this.get(t) % e)
    }

    static mul(t, e) {
      const r = ((4294901760 & t) >>> 0) * e
      const n = (65535 & t) * e
      return this.get((r >>> 0) + (n >>> 0))
    }

    static not(t) {
      return this.get(~this.get(t))
    }

    static or(t, e) {
      return this.get(this.get(t) | this.get(e))
    }

    static shiftLeft(t, e) {
      return this.get(this.get(t) << e)
    }

    static shiftRight(t, e) {
      return this.get(t) >>> e
    }

    static xor(t, e) {
      return this.get(this.get(t) ^ this.get(e))
    }
  }

  class n {
    static loop(number, handler) {
      return 'v'
        .repeat(number)
        .split('')
        .map((index, val) => handler(val))
    }
  }

  class o {
    _mat1 = 0
    _mat2 = 0
    _status = []
    _tmat = 0

    _init() {
      n.loop(7, (t) => {
        this._status[(t + 1) & 3] = m.xor(
          this._status[(t + 1) & 3],
          t
          + 1
          + m.mul(
            1812433253,
            m.xor(this._status[3 & t], m.shiftRight(this._status[3 & t], 30)),
          ),
        )
      }),
      (2147483647 & this._status[0]) == 0
      && this._status[1] === 0
      && this._status[2] === 0
      && this._status[3] === 0
      && ((this._status[0] = 66),
      (this._status[1] = 65),
      (this._status[2] = 89),
      (this._status[3] = 83)),
      n.loop(8, this._next_state.bind(this))
    }

    _next_state() {
      let e = this._status[3]
      let t = m.xor(
        m.and(this._status[0], 2147483647),
        m.xor(this._status[1], this._status[2]),
      );
      (t = m.xor(t, m.shiftLeft(t, 1))),
      (e = m.xor(e, m.xor(m.shiftRight(e, 1), t))),
      (this._status[0] = this._status[1]),
      (this._status[1] = this._status[2]),
      (this._status[2] = m.xor(t, m.shiftLeft(e, 10))),
      (this._status[3] = e),
      (this._status[1] = m.xor(
        this._status[1],
        m.and(-m.and(e, 1), this._mat1),
      )),
      (this._status[2] = m.xor(
        this._status[2],
        m.and(-m.and(e, 1), this._mat2),
      ))
    }

    generate(t) {
      this._next_state()
      let e
      let r = void 0
      return (
        (r = this._status[3]),
        (e = m.xor(this._status[0], m.shiftRight(this._status[2], 8))),
        (r = m.xor(r, e)),
        (r = m.xor(m.and(-m.and(e, 1), this._tmat), r)) % t
      )
    }

    seed(e) {
      n.loop(4, (t) => {
        e.length > t
          ? (this._status[t] = m.get(e.charAt(t).charCodeAt()))
          : (this._status[t] = m.get(110))
      }),
      (this._mat1 = this._status[1]),
      (this._mat2 = this._status[2]),
      (this._tmat = this._status[3]),
      this._init()
    }
  }

  class a {
    c = [1, 2, 2, 2, 2, 2]
    s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

    constructor() {
      this._random = new o()
      this._sign = ''
      this._inter = {}
      this._head = new f()
    }

    _addSymbol(t, e) {
      let head = this._head; let o = ''; const r = this
      return (
        n.loop(e, (t) => {
          for (let e = this.s[r._random.generate(32)]; e in head.getChildren() && head.getChildren()[e].getChar() !== '.';)
            e = r.s[r._random.generate(32)];
          (o += e),
          e in head.getChildren() || head.setChildren(e, new f()),
          (head = head.getChildren()[e])
        }),
        head.setChar(t), (this._inter[t] = o)
      )
    }

    decode(t) {
      for (let e = '', r = 4; r < t.length;) {
        if (t[r] !== '=') {
          for (let n = this._head; t[r] in n.getChildren();)
            (n = n.getChildren()[t[r]]), r++
          e += n.getChar()
        }
        else {
          (e += '='), r++
        }
      }
      return e
    }

    init(string) {
      this._random.seed(string)
      this._sign = string
      n.loop(64, (t) => {
        this._addSymbol(
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[
            t
          ],
          this.c[Number.parseInt((t + 1) / 11)],
        )
      })
      this._inter['='] = '='
    }
  }
  if (checkVersion(encryptedString)) {
    const e = new a()
    e.init(encryptedString.substr(0, 4))
    const r = e.decode(encryptedString)
    return decode(r)
  }
  else {
    debugLogger('error', 'Daily task check version failed', encryptedString)
    return { total: 0 }
  }
}

export default {}