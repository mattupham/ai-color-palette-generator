/**
 * Prompt for generating color palettes based on vibes/moods
 * @param vibe - The vibe or mood to base the palette on
 */
export function getPaletteGeneratorPrompt(vibe: string): string {
	return `Generate 8 color palettes based on the vibe or mood: "${vibe}".
Each palette should have 5 colors that harmoniously work together.

ACCESSIBILITY REQUIREMENTS (WCAG 2.1):
1. Contrast Ratios:
- Text/Background combinations must meet minimum contrast ratios:
* Normal text (under 18pt): Minimum 4.5:1 (AA), Preferred 7:1 (AAA)
* Large text (18pt+): Minimum 3:1 (AA), Preferred 4.5:1 (AAA)
- UI elements and graphical objects: Minimum 3:1 against adjacent colors

2. Color Combinations:
- Each palette should include at least one light color (#f5f5f5 or lighter) and one dark color (#333333 or darker)
- Avoid problematic combinations for color blindness (e.g., red/green, blue/purple, green/brown)
- Ensure adjacent colors have sufficient contrast for boundaries

3. Color Purpose:
- Include colors suitable for:
* Primary actions (1 color)
* Secondary/tertiary actions (1-2 colors)
* Background/surface variations (1-2 colors)
* Accent/highlight (1 color)

4. Versatility:
- Colors should work in both light and dark modes
- Include colors that maintain their perceptual qualities across devices

Return ONLY a minified JSON object without whitespace or line breaks in this exact structure:
{"palettes":[{"name":"Meaningful palette name related to the vibe","colors":["#hexcode1","#hexcode2","#hexcode3","#hexcode4","#hexcode5"],"roles":["background","primary","secondary","accent","text"]}],"vibe":"${vibe}"}

For each palette:
- Ensure every hex code is valid (6 characters with proper syntax)
- Calculate and verify contrast ratios between text colors and background colors
- Assign appropriate roles to each color (background, primary, secondary, accent, text)
- Make each palette distinct while still reflecting the vibe/mood
- Consider cultural and psychological color meanings related to the vibe`;
}
