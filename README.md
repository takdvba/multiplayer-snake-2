# 🐍 Multiplayer Snake Game

A stunning, modern multiplayer Snake game with amazing graphics and competitive gameplay!

## 🎮 Features

- **2-Player Competitive Gameplay**: Battle head-to-head in real-time
- **Selectable Win Conditions**: Choose between 50, 100, 150, or 200 points to win
- **Amazing Graphics**: 
  - Smooth animations and glowing effects
  - Detailed snake renderings with eyes
  - Glowing golden food
  - Gradient backgrounds and grid system
- **Shared Resources**: Both snakes compete for the same food
- **Physics-Based Collision**:
  - Snakes can cross each other's bodies
  - Snakes cannot collide with their own body
  - Boundary collision detection
- **Responsive Design**: Works on desktop and tablet devices

## ⚙️ Controls

### Player 1 (Red Snake)
- **↑ Arrow Up**: Move Up
- **↓ Arrow Down**: Move Down
- **← Arrow Left**: Move Left
- **→ Arrow Right**: Move Right

### Player 2 (Cyan Snake)
- **W**: Move Up
- **A**: Move Left
- **S**: Move Down
- **D**: Move Right

## 🚀 How to Play

1. **Select Win Condition**: Choose how many points are needed to win (50, 100, 150, or 200)
2. **Click Start**: Begin the game
3. **Collect Food**: Navigate your snake to eat the golden food
4. **First to the Goal**: First player to reach the selected point total wins!

## 📋 Game Rules

- **Scoring**: Each food eaten = 1 point
- **Movement**: Snakes cannot reverse into themselves
- **Collisions**: 
  - Hitting your own body = instant loss
  - Hitting the boundary = instant loss
  - Crossing opponent's body = allowed
- **Food**: When both snakes approach food simultaneously, the one that reaches it first gets the point
- **Win**: First player to reach the selected point total wins the game

## 🎨 Graphics Highlights

- Smooth gradient backgrounds
- Grid-based coordinate system
- Shadow and glow effects for depth
- Animated pulse effect on title
- Professional UI with smooth transitions
- Color-coded players (Red & Cyan)
- Eyes on snake heads that indicate direction

## 📱 Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (touch controls for menu)

## 🎯 Tips for Winning

1. **Predict Movement**: Anticipate where your opponent is heading
2. **Food Strategy**: Position yourself to reach food first
3. **Use Your Size**: Your growing snake length can be used tactically
4. **Map Control**: Dominate areas where food frequently spawns
5. **Patience**: Don't rush into your opponent's path

## 📝 File Structure

- `index.html` - Main HTML file with styling and UI
- `game.js` - Game logic, rendering, and physics
- `README.md` - This file

## 🔧 Technical Details

- Built with HTML5 Canvas
- Pure JavaScript (no external dependencies)
- Game loop at 100ms intervals for smooth gameplay
- Grid-based collision detection
- Event-driven keyboard input system

## 🎊 Enjoy the Game!

Have fun competing with your friend! May the best snake win! 🏆
