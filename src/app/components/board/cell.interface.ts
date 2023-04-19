export interface ICell {
    isBattleship: boolean;
    leftBorder: boolean;
    rightBorder: boolean;
    topBorder: boolean;
    bottomBorder: boolean;
    isActive: boolean;
    isIsland: boolean;
    battleshipLength: number;
    place: number;
    direction: 'horizontal' | 'vertical' | '';
}
