import { Status } from "./Status";

export class Player {
    playerId: string;
    status: Status = Status.WaitingForMove;

    constructor(id: string){
        this.playerId = id;
    }
}
  