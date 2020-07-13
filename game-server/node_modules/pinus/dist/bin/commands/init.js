"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils/utils");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
function default_1(program) {
    program.command('init [path]')
        .description('create a new application')
        .action(function (path) {
        init(path || constants_1.CUR_DIR);
    });
}
exports.default = default_1;
/**
 * Get user's choice on connector selecting
 *
 * @param {Function} cb
 */
function connectorType(cb) {
    utils_1.prompt('Please select underly connector, 1 for websocket(native socket), 2 for socket.io, 3 for wss, 4 for socket.io(wss), 5 for udp, 6 for mqtt: [1]', function (msg) {
        console.log('selected', msg);
        switch (msg.trim()) {
            case '':
                cb(1);
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                cb(msg.trim());
                break;
            default:
                console.log('Invalid choice! Please input 1 - 5.'.red + '\n');
                connectorType(cb);
                break;
        }
    });
}
/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */
function emptyDirectory(path) {
    if (!fs.existsSync(path))
        return true;
    let files = fs.readdirSync(path);
    return (!files || !files.length);
}
exports.emptyDirectory = emptyDirectory;
/**
 * Init application at the given directory `path`.
 *
 * @param {String} path
 */
function init(path) {
    console.log(constants_1.INIT_PROJ_NOTICE);
    connectorType(function (type) {
        let empty = emptyDirectory(path);
        if (empty) {
            process.stdin.destroy();
            console.log('start createApplication');
            createApplicationAt(path, type);
        }
        else {
            utils_1.confirm('Destination is not empty, continue? (y/n) [no] ', function (force) {
                process.stdin.destroy();
                if (force) {
                    createApplicationAt(path, type);
                }
                else {
                    utils_1.abort('Fail to init a project'.red);
                }
            });
        }
    });
}
/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */
function mkdir(path) {
    let err = mkdirp.sync(path, 0o755);
    console.log('   create : '.green + path);
}
/**
 * Copy template files to project.
 *
 * @param {String} origin
 * @param {String} target
 */
function copy(origin, target) {
    if (!fs.existsSync(origin)) {
        utils_1.abort(origin + 'does not exist.');
    }
    if (!fs.existsSync(target)) {
        mkdir(target);
        console.log('   create : '.green + target);
    }
    let datalist = fs.readdirSync(origin);
    for (let i = 0; i < datalist.length; i++) {
        let oCurrent = path.resolve(origin, datalist[i]);
        let tCurrent = path.resolve(target, datalist[i]);
        if (fs.statSync(oCurrent).isFile()) {
            console.log('   create : '.green + tCurrent + ' from : ' + oCurrent);
            fs.writeFileSync(tCurrent, fs.readFileSync(oCurrent, ''), '');
        }
        else if (fs.statSync(oCurrent).isDirectory()) {
            copy(oCurrent, tCurrent);
        }
    }
}
/**
 * Create directory and files at the given directory `path`.
 *
 * @param {String} ph
 */
function createApplicationAt(ph, type) {
    let name = path.basename(path.resolve(constants_1.CUR_DIR, ph));
    copy(path.join(__dirname, '../../../template/'), ph);
    mkdir(path.join(ph, 'game-server/dist/logs'));
    mkdir(path.join(ph, 'shared'));
    // rmdir -r
    let rmdir = function (dir) {
        let list = fs.readdirSync(dir);
        for (let i = 0; i < list.length; i++) {
            let filename = path.join(dir, list[i]);
            let stat = fs.statSync(filename);
            if (filename === '.' || filename === '..') {
            }
            else if (stat.isDirectory()) {
                rmdir(filename);
            }
            else {
                fs.unlinkSync(filename);
            }
        }
        fs.rmdirSync(dir);
    };
    let unlinkFiles;
    switch (type) {
        case '1':
            // use websocket
            unlinkFiles = ['game-server/app.ts.sio',
                'game-server/app.ts.wss',
                'game-server/app.ts.mqtt',
                'game-server/app.ts.sio.wss',
                'game-server/app.ts.udp',
                'web-server/app.js.https',
                'web-server/public/index.html.sio',
                'web-server/public/js/lib/pinusclient.js',
                'web-server/public/js/lib/pinusclient.js.wss',
                'web-server/public/js/lib/build/build.js.wss',
                'web-server/public/js/lib/socket.io.js'];
            for (let i = 0; i < unlinkFiles.length; ++i) {
                let f = path.resolve(ph, unlinkFiles[i]);
                console.log('delete : ' + f);
                fs.unlinkSync(f);
            }
            break;
        case '2':
            // use socket.io
            unlinkFiles = ['game-server/app.ts',
                'game-server/app.ts.wss',
                'game-server/app.ts.udp',
                'game-server/app.ts.mqtt',
                'game-server/app.ts.sio.wss',
                'web-server/app.js.https',
                'web-server/public/index.html',
                'web-server/public/js/lib/component.json',
                'web-server/public/js/lib/pinusclient.js.wss'];
            for (let i = 0; i < unlinkFiles.length; ++i) {
                fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
            }
            fs.renameSync(path.resolve(ph, 'game-server/app.ts.sio'), path.resolve(ph, 'game-server/app.ts'));
            fs.renameSync(path.resolve(ph, 'web-server/public/index.html.sio'), path.resolve(ph, 'web-server/public/index.html'));
            rmdir(path.resolve(ph, 'web-server/public/js/lib/build'));
            rmdir(path.resolve(ph, 'web-server/public/js/lib/local'));
            break;
        case '3':
            // use websocket wss
            unlinkFiles = ['game-server/app.ts.sio',
                'game-server/app.ts',
                'game-server/app.ts.udp',
                'game-server/app.ts.sio.wss',
                'game-server/app.ts.mqtt',
                'web-server/app.js',
                'web-server/public/index.html.sio',
                'web-server/public/js/lib/pinusclient.js',
                'web-server/public/js/lib/pinusclient.js.wss',
                'web-server/public/js/lib/build/build.js',
                'web-server/public/js/lib/socket.io.js'];
            for (let i = 0; i < unlinkFiles.length; ++i) {
                fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
            }
            fs.renameSync(path.resolve(ph, 'game-server/app.ts.wss'), path.resolve(ph, 'game-server/app.ts'));
            fs.renameSync(path.resolve(ph, 'web-server/app.js.https'), path.resolve(ph, 'web-server/app.js'));
            fs.renameSync(path.resolve(ph, 'web-server/public/js/lib/build/build.js.wss'), path.resolve(ph, 'web-server/public/js/lib/build/build.js'));
            break;
        case '4':
            // use socket.io wss
            unlinkFiles = ['game-server/app.ts.sio',
                'game-server/app.ts',
                'game-server/app.ts.udp',
                'game-server/app.ts.wss',
                'game-server/app.ts.mqtt',
                'web-server/app.js',
                'web-server/public/index.html',
                'web-server/public/js/lib/pinusclient.js'];
            for (let i = 0; i < unlinkFiles.length; ++i) {
                fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
            }
            fs.renameSync(path.resolve(ph, 'game-server/app.ts.sio.wss'), path.resolve(ph, 'game-server/app.ts'));
            fs.renameSync(path.resolve(ph, 'web-server/app.js.https'), path.resolve(ph, 'web-server/app.js'));
            fs.renameSync(path.resolve(ph, 'web-server/public/index.html.sio'), path.resolve(ph, 'web-server/public/index.html'));
            fs.renameSync(path.resolve(ph, 'web-server/public/js/lib/pinusclient.js.wss'), path.resolve(ph, 'web-server/public/js/lib/pinusclient.js'));
            rmdir(path.resolve(ph, 'web-server/public/js/lib/build'));
            rmdir(path.resolve(ph, 'web-server/public/js/lib/local'));
            fs.unlinkSync(path.resolve(ph, 'web-server/public/js/lib/component.json'));
            break;
        case '5':
            // use socket.io wss
            unlinkFiles = ['game-server/app.ts.sio',
                'game-server/app.ts',
                'game-server/app.ts.wss',
                'game-server/app.ts.mqtt',
                'game-server/app.ts.sio.wss',
                'web-server/app.js.https',
                'web-server/public/index.html',
                'web-server/public/js/lib/component.json',
                'web-server/public/js/lib/pinusclient.js.wss'];
            for (let i = 0; i < unlinkFiles.length; ++i) {
                fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
            }
            fs.renameSync(path.resolve(ph, 'game-server/app.ts.udp'), path.resolve(ph, 'game-server/app.ts'));
            fs.renameSync(path.resolve(ph, 'web-server/public/index.html.sio'), path.resolve(ph, 'web-server/public/index.html'));
            rmdir(path.resolve(ph, 'web-server/public/js/lib/build'));
            rmdir(path.resolve(ph, 'web-server/public/js/lib/local'));
            break;
        case '6':
            // use socket.io
            unlinkFiles = ['game-server/app.ts',
                'game-server/app.ts.wss',
                'game-server/app.ts.udp',
                'game-server/app.ts.sio',
                'game-server/app.ts.sio.wss',
                'web-server/app.js.https',
                'web-server/public/index.html',
                'web-server/public/js/lib/component.json',
                'web-server/public/js/lib/pinusclient.js.wss'];
            for (let i = 0; i < unlinkFiles.length; ++i) {
                fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
            }
            fs.renameSync(path.resolve(ph, 'game-server/app.ts.mqtt'), path.resolve(ph, 'game-server/app.ts'));
            fs.renameSync(path.resolve(ph, 'web-server/public/index.html.sio'), path.resolve(ph, 'web-server/public/index.html'));
            rmdir(path.resolve(ph, 'web-server/public/js/lib/build'));
            rmdir(path.resolve(ph, 'web-server/public/js/lib/local'));
            break;
    }
    let replaceFiles = ['game-server/app.ts',
        'game-server/package.json',
        'web-server/package.json'];
    for (let j = 0; j < replaceFiles.length; j++) {
        let str = fs.readFileSync(path.resolve(ph, replaceFiles[j])).toString();
        fs.writeFileSync(path.resolve(ph, replaceFiles[j]), str.replace('$', name));
    }
    let f = path.resolve(ph, 'game-server/package.json');
    let content = fs.readFileSync(f).toString();
    fs.writeFileSync(f, content.replace('#', utils_1.version));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Jpbi9jb21tYW5kcy9pbml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTBGO0FBQzFGLDBDQUFrRTtBQUVsRSx5QkFBeUI7QUFFekIsNkJBQTZCO0FBRzdCLGlDQUFpQztBQUVqQyxtQkFBeUIsT0FBZ0M7SUFDckQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7U0FDekIsV0FBVyxDQUFDLDBCQUEwQixDQUFDO1NBQ3ZDLE1BQU0sQ0FBQyxVQUFVLElBQUk7UUFDbEIsSUFBSSxDQUFDLElBQUksSUFBSSxtQkFBTyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBTkQsNEJBTUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxhQUFhLENBQUMsRUFBWTtJQUMvQixjQUFNLENBQUMsK0lBQStJLEVBQUUsVUFBVSxHQUFXO1FBQ3pLLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLFFBQVEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2hCLEtBQUssRUFBRTtnQkFDSCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sTUFBTTtZQUNWLEtBQUssR0FBRyxDQUFDO1lBQ1QsS0FBSyxHQUFHLENBQUM7WUFDVCxLQUFLLEdBQUcsQ0FBQztZQUNULEtBQUssR0FBRyxDQUFDO1lBQ1QsS0FBSyxHQUFHLENBQUM7WUFDVCxLQUFLLEdBQUc7Z0JBQ0osRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUNmLE1BQU07WUFDVjtnQkFDSSxPQUFPLENBQUMsR0FBRyxDQUFFLHFDQUE2QyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDdkUsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNsQixNQUFNO1NBQ2I7SUFDTCxDQUFDLENBQUMsQ0FB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