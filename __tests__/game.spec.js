require('../game');
const {
  isAlive,
  generate,
  regenerate,
  countNeihbors,
  drawGrid,
  attachGridEventHandler,
  getCellsFromDom
} = window.game;

jest.useFakeTimers();

describe('Game of Life', () => {
  describe('isAlive algorithm', () => {
    test('dead cell with no neighbors should return 0', () => {
      expect(isAlive(0, 0)).toEqual(0);
    });
    test('dead cell with 3 neighbors should return 1', () => {
      expect(isAlive(0, 3)).toEqual(1);
    });
    test('live cell with 0 neighbors should return 0', () => {
      expect(isAlive(1, 0)).toEqual(0);
    });
    test('live cell with 2 neighbors should return 1', () => {
      expect(isAlive(1, 2)).toEqual(1);
    });
  });

  describe('countNeighbors', () => {
    test('should count 0 for array of one', () => {
      expect(countNeihbors([1], 0)).toEqual(0);
    });
    test('should count 2 neighbors', () => {
      expect(countNeihbors([1, 1, 1, 0], 0)).toEqual(2);
    });
    test('should count 2 neighbors', () => {
      expect(countNeihbors([1, 1, 1, 0], 1)).toEqual(2);
    });
    test('should count 2 neighbors', () => {
      expect(countNeihbors([1, 1, 1, 0], 2)).toEqual(2);
    });
    test('should count 2 neighbors', () => {
      expect(countNeihbors([1, 1, 1, 0], 3)).toEqual(3);
    });
    test('should count 2 neighbors', () => {
      expect(countNeihbors([1, 1, 1, 0, 0, 0, 0, 0, 0], 4)).toEqual(3);
    });
  });

  describe('generate function', () => {
    test('should create an array of x * x', () => {
      expect(generate(1)).toEqual([0]);
      expect(generate(2)).toEqual([0, 0, 0, 0]);
    });
  });

  describe('regenerate function', () => {
    test('should not update dead cells', () => {
      const cells = generate(1);
      expect(regenerate(cells)).toEqual(cells);
    });
    test('should return all dead cells', () => {
      const initialCells = generate(2);
      const cells = generate(2);
      cells[0] = 1;
      expect(regenerate(cells)).toEqual(initialCells);
    });
    test('should return all alive cells', () => {
      const cells = [1, 1, 1, 0];
      expect(regenerate(cells)).toEqual([1, 1, 1, 1]);
    });
  });

  describe('browser grid', () => {
    test('should display living and dead cells', () => {
      document.body.innerHTML = '<div id="grid"></div>';
      drawGrid([0, 0, 1, 1]);
      expect(document.querySelectorAll('.row').length).toEqual(2);
      expect(document.querySelectorAll('.cell').length).toEqual(4);
      expect(document.querySelectorAll('.live').length).toEqual(2);
      expect(document.querySelectorAll('.dead').length).toEqual(2);
      drawGrid([1, 1, 0, 0]);
      expect(document.querySelectorAll('.row').length).toEqual(2);
      expect(document.querySelectorAll('.cell').length).toEqual(4);
      expect(document.querySelectorAll('.live').length).toEqual(2);
      expect(document.querySelectorAll('.dead').length).toEqual(2);
    });
  });

  describe('event handler for grid', () => {
    test('click on cell should toggle live/dead', () => {
      document.body.innerHTML = '<div id="grid"></div>';
      drawGrid([0]);
      attachGridEventHandler();
      expect(document.querySelectorAll('.dead').length).toEqual(1);
      expect(document.querySelectorAll('.live').length).toEqual(0);
      document.querySelector('.dead').click();
      expect(document.querySelectorAll('.dead').length).toEqual(0);
      expect(document.querySelectorAll('.live').length).toEqual(1);
      document.querySelector('.live').click();
      expect(document.querySelectorAll('.dead').length).toEqual(1);
      expect(document.querySelectorAll('.live').length).toEqual(0);
    });
  });

  describe('get cells from dom', () => {
    test('should get living and dead cells from dom', () => {
      document.body.innerHTML = '<div id="grid"></div>';
      const cells = [0, 0, 1, 1];
      drawGrid(cells);
      expect(getCellsFromDom()).toEqual(cells);
    });
  });

  describe('start function', () => {
    document.body.innerHTML = '<div id="grid"></div>';
    const getCellsFromDomSpy = jest.spyOn(game, 'getCellsFromDom');
    const regenerateSpy = jest.spyOn(game, 'regenerate');
    const drawGridSpy = jest.spyOn(game, 'drawGrid');
    game.start();
    jest.runOnlyPendingTimers();
    expect(setInterval).toHaveBeenCalled();
    expect(getCellsFromDomSpy).toHaveBeenCalled();
    expect(drawGridSpy).toHaveBeenCalled();
    expect(regenerateSpy).toHaveBeenCalled();
  });

  describe('stop function', () => {
    test('Stop should clear interval', () => {
      document.body.innerHTML = '<div id="grid"></div>';
      game.stop();
      expect(clearInterval).toHaveBeenCalled();
    });
  });
});
