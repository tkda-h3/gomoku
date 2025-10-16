#!/usr/bin/env node

import { Board, CellState } from './board.js';

/**
 * Main CLI entry point for the Gomoku game
 */
function main() {
  console.log('=== Gomoku (五目並べ) ===\n');

  // Create a new 15x15 board
  const board = new Board(15);

  // Place some sample stones to demonstrate the board
  board.placeStone(7, 7, CellState.Black);
  board.placeStone(7, 8, CellState.White);
  board.placeStone(8, 7, CellState.White);
  board.placeStone(8, 8, CellState.Black);
  board.placeStone(6, 6, CellState.Black);
  board.placeStone(9, 9, CellState.White);

  // Display the board
  console.log(board.toString());
  console.log('\nBoard displayed successfully!');
  console.log('● = Black, ○ = White, · = Empty\n');
}

main();
