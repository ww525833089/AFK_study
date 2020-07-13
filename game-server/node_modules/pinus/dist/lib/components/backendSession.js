"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backendSessionService_1 = require("../common/service/backendSessionService");
class BackendSessionComponent extends backendSessionService_1.BackendSessionService {
    constructor(app) {
        super(app);
        this.name = '__backendSession__';
        // export backend session service to the application context.
        app.set('backendSessionService', this, true);
    }
}
exports.BackendSessionComponent = BackendSessionComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZFNlc3Npb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvY29tcG9uZW50cy9iYWNrZW5kU2Vzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1GQUFnRjtBQUtoRixNQUFhLHVCQUF3QixTQUFRLDZDQUFxQjtJQUNoRSxZQUFZLEdBQWdCO1FBQzFCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUtiLFNBQUksR0FBRyxvQkFBb0IsQ0FBQztRQUoxQiw2REFBNkQ7UUFDN0QsR0FBRyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUdGO0FBUkQsMERBUUMifQ==