/*

Copyright 2008-2013 Clipperz Srl

This file is part of Clipperz, the online password manager.
For further information about its features and functionalities please
refer to http://www.clipperz.com.

* Clipperz is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License as published
  by the Free Software Foundation, either version 3 of the License, or 
  (at your option) any later version.

* Clipperz is distributed in the hope that it will be useful, but 
  WITHOUT ANY WARRANTY; without even the implied warranty of 
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public
  License along with Clipperz. If not, see http://www.gnu.org/licenses/.

*/

/***

MochiKit.DateTime 1.5

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito.  All rights Reserved.

***/

MochiKit.Base.module(MochiKit, 'DateTime', '1.5', ['Base']);

/** @id MochiKit.DateTime.isoDate */
MochiKit.DateTime.isoDate = function (str) {
    str = str + "";
    if (typeof(str) != "string" || str.length === 0) {
        return null;
    }
    var iso = str.split('-');
    if (iso.length === 0) {
        return null;
    }
    var date = new Date(parseInt(iso[0], 10), parseInt(iso[1], 10) - 1, parseInt(iso[2], 10));
    date.setFullYear(iso[0]);
    date.setMonth(iso[1] - 1);
    date.setDate(iso[2]);
    return date;
};

MochiKit.DateTime._isoRegexp = /(\d{4,})(?:-(\d{1,2})(?:-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?(?:(Z)|([+-])(\d{1,2})(?::(\d{1,2}))?)?)?)?)?/;

/** @id MochiKit.DateTime.isoTimestamp */
MochiKit.DateTime.isoTimestamp = function (str) {
    str = str + "";
    if (typeof(str) != "string" || str.length === 0) {
        return null;
    }
    var res = str.match(MochiKit.DateTime._isoRegexp);
    if (typeof(res) == "undefined" || res === null) {
        return null;
    }
    var year, month, day, hour, min, sec, msec;
    year = parseInt(res[1], 10);
    if (typeof(res[2]) == "undefined" || res[2] === '') {
        return new Date(year);
    }
    month = parseInt(res[2], 10) - 1;
    day = parseInt(res[3], 10);
    if (typeof(res[4]) == "undefined" || res[4] === '') {
        return new Date(year, month, day);
    }
    hour = parseInt(res[4], 10);
    min = parseInt(res[5], 10);
    sec = (typeof(res[6]) != "undefined" && res[6] !== '') ? parseInt(res[6], 10) : 0;
    if (typeof(res[7]) != "undefined" && res[7] !== '') {
        msec = Math.round(1000.0 * parseFloat("0." + res[7]));
    } else {
        msec = 0;
    }
    if ((typeof(res[8]) == "undefined" || res[8] === '') && (typeof(res[9]) == "undefined" || res[9] === '')) {
        return new Date(year, month, day, hour, min, sec, msec);
    }
    var ofs;
    if (typeof(res[9]) != "undefined" && res[9] !== '') {
        ofs = parseInt(res[10], 10) * 3600000;
        if (typeof(res[11]) != "undefined" && res[11] !== '') {
            ofs += parseInt(res[11], 10) * 60000;
        }
        if (res[9] == "-") {
            ofs = -ofs;
        }
    } else {
        ofs = 0;
    }
    return new Date(Date.UTC(year, month, day, hour, min, sec, msec) - ofs);
};

/** @id MochiKit.DateTime.toISOTime */
MochiKit.DateTime.toISOTime = function (date, realISO/* = false */) {
    if (typeof(date) == "undefined" || date === null) {
        return null;
    }
    var _padTwo = MochiKit.DateTime._padTwo;
    if (realISO) {
        // adjust date for UTC timezone
        date = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    }
    var lst = [
        (realISO ? _padTwo(date.getHours()) : date.getHours()),
        _padTwo(date.getMinutes()),
        _padTwo(date.getSeconds())
    ];
    return lst.join(":") + (realISO ? "Z" : "");
};

/** @id MochiKit.DateTime.toISOTimeStamp */
MochiKit.DateTime.toISOTimestamp = function (date, realISO/* = false*/) {
    if (typeof(date) == "undefined" || date === null) {
        return null;
    }
    var time = MochiKit.DateTime.toISOTime(date, realISO);
    var sep = realISO ? "T" : " ";
    if (realISO) {
        // adjust date for UTC timezone
        date = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    }
    return MochiKit.DateTime.toISODate(date) + sep + time;
};

/** @id MochiKit.DateTime.toISODate */
MochiKit.DateTime.toISODate = function (date) {
    if (typeof(date) == "undefined" || date === null) {
        return null;
    }
    var _padTwo = MochiKit.DateTime._padTwo;
    var _padFour = MochiKit.DateTime._padFour;
    return [
        _padFour(date.getFullYear()),
        _padTwo(date.getMonth() + 1),
        _padTwo(date.getDate())
    ].join("-");
};

/** @id MochiKit.DateTime.americanDate */
MochiKit.DateTime.americanDate = function (d) {
    d = d + "";
    if (typeof(d) != "string" || d.length === 0) {
        return null;
    }
    var a = d.split('/');
    return new Date(a[2], a[0] - 1, a[1]);
};

MochiKit.DateTime._padTwo = function (n) {
    return (n > 9) ? n : "0" + n;
};

MochiKit.DateTime._padFour = function(n) {
    switch(n.toString().length) {
        case 1: return "000" + n; break;
        case 2: return "00" + n; break;
        case 3: return "0" + n; break;
        case 4:
        default:
            return n;
    }
};

/** @id MochiKit.DateTime.toPaddedAmericanDate */
MochiKit.DateTime.toPaddedAmericanDate = function (d) {
    if (typeof(d) == "undefined" || d === null) {
        return null;
    }
    var _padTwo = MochiKit.DateTime._padTwo;
    return [
        _padTwo(d.getMonth() + 1),
        _padTwo(d.getDate()),
        d.getFullYear()
    ].join('/');
};

/** @id MochiKit.DateTime.toAmericanDate */
MochiKit.DateTime.toAmericanDate = function (d) {
    if (typeof(d) == "undefined" || d === null) {
        return null;
    }
    return [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/');
};

MochiKit.DateTime.__new__ = function () {
    MochiKit.Base.nameFunctions(this);
};

MochiKit.DateTime.__new__();

MochiKit.Base._exportSymbols(this, MochiKit.DateTime);
