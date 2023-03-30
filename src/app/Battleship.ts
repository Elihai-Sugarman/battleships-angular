export interface Battleship {
    cells: number[][]
    exposedCellsCount: number
    direction: 'vertical' | 'horizontal'
}