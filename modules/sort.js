// Сортирует строки, игнорируя все пробельные символы
// Использует Intl.Collator для правильной локализованной сортировки
const sortByAlphabetNoSpaces = (arr) => {
    const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
    return arr.slice().sort((a, b) => {
        const aClean = a.replace(/\s+/g, '');
        const bClean = b.replace(/\s+/g, '');
        return collator.compare(aClean, bClean);
    });
};

module.exports = { sortByAlphabetNoSpaces };