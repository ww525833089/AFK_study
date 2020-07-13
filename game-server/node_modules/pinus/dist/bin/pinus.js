#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
const fs = require("fs");
const program = require("commander");
const constants_1 = require("./utils/constants");
const utils_1 = require("./utils/utils");
const util_1 = require("util");
program.version(utils_1.version);
program.command('*')
    .action(function () {
    console.log(constants_1.COMMAND_ERROR);
});
fs.readdirSync(__dirname + '/commands').forEach(function (filename) {
    if (/\.js$/.test(filename)) {
        let name = filename.substr(0, filename.lastIndexOf('.'));
        let _command = require('./commands/' + name).default;
        if (util_1.isFunction(_command)) {
            _command(program);
        }
    }
});
program.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGludXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9iaW4vcGludXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUE7O0dBRUc7QUFDSCx5QkFBeUI7QUFHekIscUNBQXFDO0FBQ3JDLGlEQUFrRDtBQUNsRCx5Q0FBd0M7QUFDeEMsK0JBQWtDO0FBRWxDLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLENBQUM7QUFFekIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7S0FDZixNQUFNLENBQUM7SUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUFhLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUMsQ0FBQztBQUVQLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLFFBQVE7SUFDOUQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3hCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUNyRCxJQUFJLGlCQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdEIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JCO0tBQ0o7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDIn0=