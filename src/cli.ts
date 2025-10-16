#!/usr/bin/env node

import { Command } from "commander";
import { createGomokuCommand } from "./commands/gomoku.js";

const program = new Command();

program
  .name("gomoku")
  .description("A CLI tool with future React frontend support")
  .version("1.0.0");

program.addCommand(createGomokuCommand());

program.parse();
