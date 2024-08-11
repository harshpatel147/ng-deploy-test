const fs = require('fs');
const path = require('path');

// Function to generate a random hex color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Generate random colors
const backgroundColor = getRandomColor();
const fontColor = getRandomColor();

// Define the path to the SCSS file
const scssFilePath = path.join(__dirname, 'src/assets/scss/_random-color.scss');

// Write the colors to the SCSS file
const scssContent = `
$background-color: ${backgroundColor};
$font-color: ${fontColor};

body {
    background-color: $background-color;
    color: $font-color;
}
`;

fs.writeFileSync(scssFilePath, scssContent, 'utf8');

console.log(`Generated background color: ${backgroundColor}`);
console.log(`Generated font color: ${fontColor}`);
