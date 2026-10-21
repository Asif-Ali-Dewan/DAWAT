import React from 'react';
import { ThemeConfiguration, ThemePreset, CardVariant } from '../../types/invitation';
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
    { label: 'Playfair Display (Editorial Serif)', heading: 'Playfair Display', body: 'Plus Jakarta Sans' },
    { label: 'Plus Jakarta Sans (Crisp Modern)', heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans' },
    { label: 'Outfit (Geometric Clean)', heading: 'Outfit', body: 'Plus Jakarta Sans' },
  ];

  const borderOptions: Array<{ label: string; value: ThemeConfiguration['borderStyle'] }> = [
    { label: 'Traditional Mehrab Arch', value: 'traditional-arch' },
    { label: 'Ornate Gold Inlay', value: 'ornate-gold' },
    { label: 'Corporate Geometric Line', value: 'corporate-geometric' },
    { label: 'Clean Borderless', value: 'clean-borderless' },
  ];

  const decorativeOptions: Array<{ label: string; value: ThemeConfiguration['decorativeElement'] }> = [
    { label: 'Mehrab & Bismillah Arch', value: 'paisley-arch' },
    { label: 'Royal Monogram Seal', value: 'monogram' },
    { label: 'Executive Corporate Seal', value: 'corporate-seal' },
    { label: 'None (Pure Minimal)', value: 'none' },
  ];

  const cardVariants: Array<{ label: string; value: CardVariant; desc: string }> = [
    { label: 'Traditional Desi Royal', value: 'traditional-desi', desc: 'Bangladeshi & Pakistani heritage wedding with mehrab arch' },
    { label: 'Corporate Executive Pass', value: 'corporate-executive', desc: 'Clean geometric summit card with keynote agenda' },
    { label: 'Royal Sapphire Evening', value: 'royal-sapphire', desc: 'Majestic deep sapphire velvet with gold foil' },
    { label: 'Warm Alabaster Minimal', value: 'minimal-ivory', desc: 'Solid ivory paper with sharp burgundy typography' },
  ];

  const canvasColors = [
    { name: 'Imperial Burgundy (#350010)', hex: '#350010', desc: 'Bangladeshi & Pakistani Royal', text: '#FAF7F2' },
    { name: 'Royal Sapphire (#290EA0)', hex: '#290EA0', desc: 'Majestic Night Velvet', text: '#FAF7F2' },
    { name: 'Executive Midnight (#0F172A)', hex: '#0F172A', desc: 'Corporate Summit Slate', text: '#FAF7F2' },
    { name: 'Warm Alabaster (#FAF7F2)', hex: '#FAF7F2', desc: 'Crisp Ivory Silk', text: '#350010' },
    { name: 'Imperial Emerald (#064E3B)', hex: '#064E3B', desc: 'Deep Heritage Green', text: '#FAF7F2' },
    { name: 'Executive Steel (#1E293B)', hex: '#1E293B', desc: 'Modern Architecture', text: '#FAF7F2' },
  ];

  const accentColors = [
    { name: 'Antique Gold (#D4AF37)', hex: '#D4AF37' },
    { name: 'Luminous Champagne (#F3DF93)', hex: '#F3DF93' },
    { name: 'Imperial Burgundy (#350010)', hex: '#350010' },
    { name: 'Royal Sapphire (#290EA0)', hex: '#290EA0' },
    { name: 'Silver Platinum (#E2E8F0)', hex: '#E2E8F0' },
    { name: 'Warm Copper (#C5A059)', hex: '#C5A059' },
  ];

  return (
    <div className="space-y-8">
      {/* Preset Theme Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <Palette className="w-4 h-4 text-[#350010]" />
              <span>Choose Curated Card Theme</span>
            </h3>
            <p className="text-xs text-stone-500">
              Select a specialized preset or customize solid colors and textures below.
            </p>
          </div>
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#350010] hover:bg-[#20000a] text-white transition"
            >
              Apply Theme
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {presetList.map((preset: ThemePresetDefinition) => {
            const isSelected = currentTheme.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset.id)}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all group overflow-hidden ${
                  isSelected
                    ? 'border-[#350010] ring-2 ring-[#350010]/20 bg-stone-50'
                    : 'border-stone-200 hover:border-stone-400 bg-white'
                }`}
              >
                {/* Theme Color Preview swatch strip */}
                <div
                  className="w-full h-12 rounded-xl mb-3 flex items-center justify-center border border-black/10 relative"
                  style={{ backgroundColor: preset.cardColor }}
                >
                  <span
                    className="font-heading font-bold text-sm tracking-wider"
                    style={{ color: preset.accentColor }}
                  >
                    DAWAT
                  </span>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#350010] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                  {preset.name}
                </h4>
                <p className="text-[11px] text-[#350010] font-semibold truncate mt-0.5">
                  {preset.subtitle}
                </p>
                <p className="text-[10px] text-stone-500 line-clamp-2 mt-1">
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
          <Sparkles className="w-4 h-4 text-[#350010]" />
          <span>Card Canvas & Styling Controls</span>
        </h3>

        {/* 1. Card Variant Selection */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center space-x-1.5">
            <Layout className="w-3.5 h-3.5 text-stone-500" />
            <span>Card Layout Architecture</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {cardVariants.map((variant) => {
              const isSelected = currentTheme.cardVariant === variant.value;
              return (
                <button
                  key={variant.value}
                  type="button"
                  onClick={() => handleUpdate('cardVariant', variant.value)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    isSelected
                      ? 'border-[#350010] bg-stone-50 font-bold ring-1 ring-[#350010]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-stone-900 font-bold">{variant.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#350010]" />}
                  </div>
                  <p className="text-[11px] text-stone-500 font-normal leading-relaxed">
                    {variant.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Card Solid Color */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Layout className="w-3.5 h-3.5 text-stone-500" />
              <span>Solid Card Canvas Color (No Gradients)</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-[#350010]">
              {currentTheme.cardColor || '#350010'}
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {canvasColors.map((option) => {
              const isSelected = currentTheme.cardColor?.toLowerCase() === option.hex.toLowerCase();
              return (
                <button
                  key={option.hex}
                  type="button"
                  onClick={() => handleUpdate('cardColor', option.hex)}
                  className={`flex items-center space-x-3 p-3 rounded-2xl border text-left transition ${
                    isSelected
                      ? 'border-[#350010] ring-2 ring-[#350010]/30 bg-stone-50 font-bold'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-xl border border-black/20 shrink-0 shadow-sm flex items-center justify-center font-bold text-[10px]"
                    style={{ backgroundColor: option.hex, color: option.text }}
                  >
                    Aa
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs text-stone-900 truncate font-semibold">
                      {option.name}
                    </span>
                    <span className="text-[10px] text-stone-400 block truncate">
                      {option.desc}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#350010] text-[#D4AF37] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Accent & Foil Color */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            Foil Stamping & Highlight Contrast Color
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            {accentColors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => handleUpdate('accentColor', c.hex)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                  currentTheme.accentColor.toLowerCase() === c.hex.toLowerCase()
                    ? 'border-[#350010] bg-[#350010]/5 text-[#350010] font-bold ring-1 ring-[#350010]'
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

        {/* 5. Typography Pairings */}
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
                    ? 'border-[#350010] bg-[#350010]/5 text-[#350010] font-bold ring-1 ring-[#350010]'
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

        {/* 6. Border Style */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-stone-500" />
            <span>Card Border & Framing Inlay</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {borderOptions.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => handleUpdate('borderStyle', b.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs transition ${
                  currentTheme.borderStyle === b.value
                    ? 'border-[#350010] bg-[#350010] text-[#D4AF37] font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* 7. Center Decorative Element */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-stone-500" />
            <span>Center Emblem & Crest</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {decorativeOptions.map((dec) => (
              <button
                key={dec.value}
                type="button"
                onClick={() => handleUpdate('decorativeElement', dec.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs transition ${
                  currentTheme.decorativeElement === dec.value
                    ? 'border-[#350010] bg-[#350010] text-[#D4AF37] font-bold'
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
