import chalk from "chalk";
import type { BaseServer } from "./BaseServer";

export class Logger {
  constructor(public base: BaseServer) {}

  get time() {
    return new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  }

  /**
   * Print all buffer output.
   */
  public printBuf(buf: Buffer) {
    return buf.toString("hex").match(/../g)?.join(" ");
  }

  public info(...content: unknown[]) {
    console.log(`[${this.time} - INFO    ]`, ...content);
  }

  public ready(...content: unknown[]) {
    console.log(`[${this.time} - ${chalk.greenBright("READY")}   ]`, ...content);
  }

  public discord(...content: unknown[]) {
    console.log(`[${this.time} - ${chalk.greenBright("DISCORD")} ]`, ...content);
  }

  public event(...content: unknown[]) {
    console.log(`[${this.time} - ${chalk.blueBright("EVENT")}   ]`, ...content);
  }

  public update(...content: unknown[]) {
    console.log(`[${this.time} - ${chalk.cyan("UPDATE")}  ]`, ...content);
  }

  public action(...content: unknown[]) {
    console.log(`[${this.time} - ${chalk.rgb(242, 124, 27)("ACTION")}  ]`, ...content);
  }

  public dialog(...content: unknown[]) {
    console.log(`[${this.time} - ${chalk.rgb(69, 214, 200)("DIALOG")}  ]`, ...content);
  }

  public command(...content: unknown[]) {
    console.log(`[${this.time} - ${chalk.rgb(95, 232, 150)("COMMAND")} ]`, ...content);
  }

  public debug(...content: unknown[]) {
    if (this.base.config.debugMode) {
      console.log(`[${this.time} - ${chalk.rgb(211, 237, 64)("DEBUG")}   ]`, ...content);
    }
  }

  public warn(...content: unknown[]) {
    console.log(`[${this.time} - ${chalk.rgb(255, 168, 18)("WARN")}    ]`, ...content);
  }

  public error(...content: unknown[]) {
    console.log(`[${this.time} - ${chalk.rgb(230, 68, 28)("ERROR")}   ]`, ...content);
  }
}
