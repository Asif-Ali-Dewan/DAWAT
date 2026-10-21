import React from 'react';
import { ThemeConfiguration, ThemePreset } from '../../types/invitation';
import { THEME_PRESETS, ThemePresetDefinition } from '../../config/themes';
import { Palette, Sparkles, Layout, Type, Shield, Check } from 'lucide-react';

interface ThemeCustomizerProps {
  currentTheme: ThemeConfiguration;
  onChange: (updatedTheme: ThemeConfiguration) => void;
  onSave?: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  currentTheme,
  onChange,
  onSave,
}) => {
  const handlePresetSelect = (presetKey: ThemePreset) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      onChange({ ...preset.config });
    }
  };

  const handleUpdate = <K extends keyof ThemeConfiguration>(
    key: K,
    value: ThemeConfiguration[K]
  ) => {
    onChange({
      ...currentTheme,
      [key]: value,
    });
  };

  const presetList = Object.values(THEME_PRESETS);

  const fontOptions = [
    { label: 'Cinzel (Regal Classical)', heading: 'Cinzel', body: 'Cormorant Garamond' },
    { label: 'Alex Brush (Script Romance)', heading: 'Alex Brush', body: 'Playfair Display' },
    { label: 'Playfair Display (Editorial Serif)', heading: 'Playfair Display', body: 'Plus Jakarta Sans' },
    { label: 'Outfit (Modern Crisp Sans)', heading: 'Outfit', body: 'Plus Jakarta Sans' },
  ];

  const borderOptions: Array<{ label: string; value: ThemeConfiguration['borderStyle'] }> = [
    { label: 'Double Gold Line', value: 'double-gold' },
    { label: 'Floral Corner Accents', value: 'floral-corners' },
    { label: 'Ornate Filigree', value: 'ornate' },
    { label: 'Minimalist Thin', value: 'minimal-thin' },
    { label: 'Clean Borderless', value: 'clean' },
  ];

  const decorativeOptions: Array<{ label: string; value: ThemeConfiguration['decorativeElement'] }> = [
    { label: 'Botanical Crest', value: 'botanical' },
    { label: 'Monogram Seal', value: 'monogram' },
    { label: 'Floral Motif', value: 'floral' },
    { label: 'Interlocking Rings', value: 'rings' },
    { label: 'None (Pure Minimal)', value: 'none' },
  ];

  const colorPalettes = [
    { name: 'Imperial Gold', hex: '#C59B27' },
    { name: 'Warm Amber', hex: '#D97706' },
    { name: 'Royal Emerald', hex: '#047857' },
    { name: 'Midnight Charcoal', hex: '#1C1917' },
    { name: 'Rose Gold', hex: '#BE185D' },
    { name: 'Burgundy Velvet', hex: '#831843' },
  ];

  return (
    <div className="space-y-8">
      {/* Preset Theme Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <Palette className="w-4 h-4 text-amber-600" />
              <span>Choose A Designer Wedding Theme</span>
            </h3>
            <p className="text-xs text-stone-500">
              Select a curated luxury theme or adjust specific design variables below.
            </p>
          </div>
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow transition"
            >
              Apply & Save
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {presetList.map((preset: ThemePresetDefinition) => {
            const isSelected = currentTheme.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset.id)}
                className={`relative text-left p-3.5 rounded-2xl border-2 transition-all group overflow-hidden ${
                  isSelected
                    ? 'border-amber-600 ring-2 ring-amber-400/30 shadow-md bg-amber-50/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                {/* Theme Color Preview swatch strip */}
                <div
                  className="w-full h-10 rounded-xl mb-3 flex items-center justify-center border border-black/10 relative"
                  style={{ backgroundColor: preset.previewBg }}
                >
                  <span
                    className="font-heading font-bold text-xs"
                    style={{ color: preset.previewAccent }}
                  >
                    Aa
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                  {preset.name}
                </h4>
                <p className="text-[11px] text-amber-700 font-medium truncate">
                  {preset.subtitle}
                </p>
                <p className="text-[10px] text-stone-400 line-clamp-2 mt-1">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controlled Customization Accordions */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-6">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Fine-Tune Design Tokens</span>
        </h3>

        {/* 1. Accent Color */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            Accent & Foil Color
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            {colorPalettes.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => handleUpdate('accentColor', c.hex)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                  currentTheme.accentColor.toLowerCase() === c.hex.toLowerCase()
                    ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Typography Pairings */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center space-x-1.5">
            <Type className="w-3.5 h-3.5 text-stone-500" />
            <span>Typography & Heading Font</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {fontOptions.map((font) => (
              <button
                key={font.label}
                type="button"
                onClick={() => {
                  handleUpdate('fontHeading', font.heading);
                  handleUpdate('fontBody', font.body);
                }}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  currentTheme.fontHeading === font.heading
                    ? 'border-amber-600 bg-amber-50/40 text-amber-950 font-bold ring-1 ring-amber-500'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="block font-medium">{font.label}</span>
                <span className="text-[11px] text-stone-400">
                  {font.heading} + {font.body}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Border Style */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-stone-500" />
            <span>Card Border & Framing</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {borderOptions.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => handleUpdate('borderStyle', b.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs transition ${
                  currentTheme.borderStyle === b.value
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Decorative Element */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-stone-500" />
            <span>Center Decorative Element</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {decorativeOptions.map((dec) => (
              <button
                key={dec.value}
                type="button"
                onClick={() => handleUpdate('decorativeElement', dec.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs transition ${
                  currentTheme.decorativeElement === dec.value
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {dec.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
