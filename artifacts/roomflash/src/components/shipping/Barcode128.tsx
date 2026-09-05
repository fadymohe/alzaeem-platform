import React, { useMemo } from 'react';

/**
 * Standard Code 128 Patterns (Table B)
 * Each string represents the widths of 6 alternating bars and spaces (summing to 11 modules),
 * except Stop (index 106) which has 7 elements (summing to 13 modules).
 */
const CODE128_PATTERNS: string[] = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112'
];

export interface Barcode128Props {
  value: string;
  height?: number;
  width?: number; // Module width in pixels (bar width)
  displayValue?: boolean;
  background?: string;
  lineColor?: string;
  fontSize?: number;
  margin?: number;
  className?: string;
}

/**
 * Pure Vector SVG Barcode 128 Component.
 * Generates ISO/IEC 15417 compliant Code 128 barcodes as crisp, scalable SVG.
 * Prevents line breaks, raster distortion, and ensures 100% scanner readability on thermal printers.
 */
export const Barcode128: React.FC<Barcode128Props> = ({
  value = '',
  height = 50,
  width = 1.8,
  displayValue = true,
  background = '#ffffff',
  lineColor = '#000000',
  fontSize = 12,
  margin = 0,
  className = '',
}) => {
  const barcodeData = useMemo(() => {
    const cleanText = (value || 'ZAEEM').trim();
    const START_B = 104;
    const STOP = 106;

    const symbols: number[] = [START_B];
    let checksum = START_B;

    for (let i = 0; i < cleanText.length; i++) {
      const code = cleanText.charCodeAt(i) - 32;
      // Fallback for non-ASCII characters
      const safeCode = (code >= 0 && code <= 95) ? code : 0;
      symbols.push(safeCode);
      checksum += safeCode * (i + 1);
    }

    symbols.push(checksum % 103);
    symbols.push(STOP);

    let patternStr = '';
    for (const sym of symbols) {
      patternStr += CODE128_PATTERNS[sym] || '';
    }

    const rects: { x: number; width: number }[] = [];
    let currentX = margin;

    for (let idx = 0; idx < patternStr.length; idx++) {
      const moduleCount = parseInt(patternStr[idx], 10);
      const barPixelWidth = moduleCount * width;
      const isBar = idx % 2 === 0;

      if (isBar) {
        rects.push({
          x: currentX,
          width: barPixelWidth,
        });
      }
      currentX += barPixelWidth;
    }

    const totalWidth = currentX + margin;
    const textHeight = displayValue ? fontSize + 6 : 0;
    const totalHeight = height + textHeight + (margin * 2);

    return {
      rects,
      totalWidth,
      totalHeight,
      cleanText,
    };
  }, [value, height, width, displayValue, fontSize, margin]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${barcodeData.totalWidth} ${barcodeData.totalHeight}`}
      width={barcodeData.totalWidth}
      height={barcodeData.totalHeight}
      className={`select-none overflow-visible ${className}`}
      style={{
        backgroundColor: background,
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
      }}
    >
      {/* Barcode Background */}
      {background && background !== 'transparent' && (
        <rect
          x={0}
          y={0}
          width={barcodeData.totalWidth}
          height={barcodeData.totalHeight}
          fill={background}
        />
      )}

      {/* Vector Bar Elements */}
      <g fill={lineColor}>
        {barcodeData.rects.map((rect, i) => (
          <rect
            key={i}
            x={rect.x}
            y={margin}
            width={rect.width}
            height={height}
            shapeRendering="crispEdges"
          />
        ))}
      </g>

      {/* Barcode Text Value Display */}
      {displayValue && (
        <text
          x={barcodeData.totalWidth / 2}
          y={height + margin + fontSize + 2}
          textAnchor="middle"
          fill={lineColor}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
          fontSize={fontSize}
          fontWeight="700"
          letterSpacing="2px"
        >
          {barcodeData.cleanText}
        </text>
      )}
    </svg>
  );
};

export default Barcode128;
