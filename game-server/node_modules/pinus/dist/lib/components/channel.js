"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channelService_1 = require("../common/service/channelService");
class ChannelComponent extends channelService_1.ChannelService {
    constructor(app, opts) {
        super(app, opts);
        this.name = '__channel__';
        app.set('channelService', this, true);
    }
}
exports.ChannelComponent = ChannelComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb21wb25lbnRzL2NoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxRUFBeUY7QUFJekYsTUFBYSxnQkFBaUIsU0FBUSwrQkFBYztJQUNsRCxZQUFZLEdBQWdCLEVBQUUsSUFBMkI7UUFDdkQsS0FBSyxDQUFDLEdBQUcsRUFBRyxJQUFJLENBQUMsQ0FBQztRQUdwQixTQUFJLEdBQUcsYUFBYSxDQUFDO1FBRm5CLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FFRjtBQU5ELDRDQU1DIn0=