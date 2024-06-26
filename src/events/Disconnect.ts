import { Listener } from "../abstracts/Listener.js";
import { BaseServer } from "../structures/BaseServer.js";

export default class extends Listener<"disconnect"> {
  constructor(base: BaseServer) {
    super(base);
    this.name = "disconnect";
  }

  public run(netID: number): void {
    this.base.log.info("Peer", netID, "disconnected");
    const peer = this.base.cache.users.getSelf(netID);
    peer?.leaveWorld();
    peer?.saveToDatabase();

    this.base.cache.users.delete(netID);
  }
}
