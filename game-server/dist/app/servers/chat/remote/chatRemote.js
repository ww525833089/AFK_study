"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(app) {
    return new ChatRemote(app);
}
exports.default = default_1;
class ChatRemote {
    constructor(app) {
        this.app = app;
        this.app = app;
        this.channelService = app.get('channelService');
    }
    async add(uid, sid, name, flag) {
        let channel = this.channelService.getChannel(name, flag);
        let username = uid.split('*')[0];
        let param = {
            user: username
        };
        channel.pushMessage('onAdd', param);
        if (!!channel) {
            channel.add(uid, sid);
        }
        return this.get(name, flag);
    }
    get(name, flag) {
        let users = [];
        let channel = this.channelService.getChannel(name, flag);
        if (!!channel) {
            users = channel.getMembers();
        }
        for (let i = 0; i < users.length; i++) {
            users[i] = users[i].split('*')[0];
        }
        return users;
    }
    async kick(uid, sid, name) {
        let channel = this.channelService.getChannel(name, false);
        if (!!channel) {
            channel.leave(uid, sid);
        }
        let username = uid.split('*')[0];
        let param = {
            user: username
        };
        channel.pushMessage('onLeave', param);
    }
}
exports.ChatRemote = ChatRemote;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdFJlbW90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2FwcC9zZXJ2ZXJzL2NoYXQvcmVtb3RlL2NoYXRSZW1vdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxtQkFBeUIsR0FBZTtJQUNwQyxPQUFPLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFGRCw0QkFFQztBQVdELE1BQWEsVUFBVTtJQUNuQixZQUFvQixHQUFlO1FBQWYsUUFBRyxHQUFILEdBQUcsQ0FBWTtRQUMvQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFLTSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVUsRUFBRSxHQUFVLEVBQUUsSUFBVyxFQUFDLElBQVk7UUFDN0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hELElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxLQUFLLEdBQUc7WUFDUixJQUFJLEVBQUMsUUFBUTtTQUNoQixDQUFDO1FBQ0YsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsSUFBRyxDQUFDLENBQUMsT0FBTyxFQUFDO1lBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7U0FDeEI7UUFFRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTyxHQUFHLENBQUMsSUFBVyxFQUFDLElBQVk7UUFDaEMsSUFBSSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBQ3pCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUM7WUFDVCxLQUFLLEdBQUcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ2hDO1FBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFVLEVBQUcsR0FBVSxFQUFHLElBQVc7UUFDbkQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpELElBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBQztZQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqQyxJQUFJLEtBQUssR0FBRztZQUNSLElBQUksRUFBQyxRQUFRO1NBQ2hCLENBQUM7UUFDRixPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUV6QyxDQUFDO0NBRUo7QUFsREQsZ0NBa0RDIn0=