// Components/Productbundle/BundleLivePreview.jsx
import { useEffect } from "react";
import { Card } from "@shopify/polaris";

/* ------------------------------------------------------------------ */
/*  UTILITIES                                                         */
/* ------------------------------------------------------------------ */
const colorHexMap = {
  black:  "#000000",
  purple: "#6F42C1",
  blue:   "#4285F4",
  teal:   "#20B2AA",
  green:  "#4CAF50",
  pink:   "#FF69B4",
  red:    "#FF0000",
  orange: "#FFA500",
  yellow: "#FFFF00",
  mint:   "#98FB98",
};

const radius = (shape) =>
  shape === "Rounded"  ? "10px" :
  shape === "Pill"     ? "50px" :
  shape === "Squared"  ?  "0px" :  "8px";

const fw = (w) =>
  w === "Bold"   || w === "bold"   ? "bold" :
  w === "Lighter"               ? "300"  : "normal";

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                         */
/* ------------------------------------------------------------------ */
export default function BundleLivePreview(props) {

  
  /* -------------------------------------------------------------- */
  /*  Destructure with sane fallbacks                               */
  /* -------------------------------------------------------------- */
  const {
    headerText               = "",
    alignment                = "left",
    footerText               = "",
    buttonText               = "Add to cart",
    selectedTemplate,
    selectedColor            = "purple",
    settings                 = {},
    products                 = [],
    highlightOption          = "none",
    highlightTitle           = "",
    highlightTimerTitle      = "",
    timerFormat              = "hh:mm:ss",
    highlightStyle           = "solid",
    isBlinking               = false,
    typography               = {},
    spacing                  = {},
    shapes                   = {},
    productImageSize         = 56,
    borderThickness          = {},
    colors                   = {},
  } = props;

  const themeColor = colorHexMap[selectedColor] || "#FF6B6B";



  /* -------------------------------------------------------------- */
  /*  Inject blink key-frame only in the browser                    */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (typeof document === "undefined") return;        // SSR guard
    const id = "bundle-preview-blink";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        @keyframes blink {
          0%,50%,100% { opacity: 1 }
          25%,75%    { opacity: 0 }
        }`;
      document.head.appendChild(style);
    }
  }, []);

  /* -------------------------------------------------------------- */
  /*  Computed styles                                               */
  /* -------------------------------------------------------------- */
  const css = {
    container: {
      marginTop:    `${spacing.bundleTop    || 10}px`,
      marginBottom: `${spacing.bundleBottom ||  6}px`,
    },
    header: {
      display:   "flex",
      alignItems:"center",
      justifyContent:"space-between",
      fontSize:  `${typography.header?.size || 18}px`,
      fontWeight:fw(typography.header?.weight),
      color:     colors.headerText || "#000",
      marginBottom:"20px",
    },
    headerTitle: { textAlign: alignment, flex: 1 },
    bodyWrap: {
      display:"flex",
      flexDirection:"column",
      alignItems:
        alignment === "center" ? "center" :
        alignment === "right"  ? "flex-end" : "flex-start",
      gap:"10px",
      flexWrap:"wrap",
    },
    product: {
      display:"flex",
      gap:"12px",
      width:"100%",
      padding:"10px 14px",
      background: colors.background
        ? `${colors.background}10` : `${themeColor}10`,
      border: `${borderThickness.bundle || 1}px solid ${
                colors.border || "#E1E3E5"}`,
      borderRadius: radius(shapes.bundle),
    },
    img: {
      width:`${productImageSize}px`,
      height:"auto",
      objectFit:"cover",
      borderRadius:"5px",
    },
    title: {
      fontSize:`${typography.titlePrice?.size || 16}px`,
      fontWeight: fw(typography.titlePrice?.weight),
      color: colors.titleText || "#000",
    },
    price: {
      fontSize:`${typography.titlePrice?.size || 16}px`,
      fontWeight: fw(typography.titlePrice?.weight),
      color: colors.price || "#000",
      display:"flex", flexDirection:"row-reverse", gap:"8px",
    },
    compare: {
      fontSize:`${(typography.titlePrice?.size || 16) - 4}px`,
      textDecoration:"line-through",
      color: colors.comparedPrice || "#FF0000",
    },
    qtyBox: {
      marginTop:"4px",
      width:"25px",
      padding:"4px 0",
      display:"flex", justifyContent:"center", alignItems:"center",
      backgroundColor: colors.quantityBackground
        ? `${colors.quantityBackground}40` : `${themeColor}40`,
      borderRadius:"4px",
    },
    qty: {
      fontSize:`${typography.quantityPrice?.size || 13}px`,
      fontWeight: fw(typography.quantityPrice?.fontStyle),
      color: colors.quantityText || "#000",
      lineHeight:1,
    },
    plus: { fontSize:"30px", margin:"0 10px", color: colors.titleText || "#000" },
    footer: {
      position:"relative",
      margin:`${spacing.footerTop || 20}px 0 ${spacing.footerBottom || 10}px`,
      padding:"15px",
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      background: colors.footerBackground || "#F6F6F7",
      borderRadius: radius(shapes.footer),
      border: `${borderThickness.footer || 0}px solid ${
                colors.border || "#E1E3E5"}`,
    },
    footerText: {
      fontSize:`${typography.titlePrice?.size || 16}px`,
      fontWeight:"bold",
      color: colors.footerText || themeColor,
      flex:1,
      display:"flex",
      justifyContent:"space-between",
    },
    button: {
      width:"100%",
      padding:"12px 20px",
      fontSize:`${typography.titlePrice?.size || 16}px`,
      fontWeight:"bold",
      background: colors.buttonBackground || themeColor,
      color: colors.addToCartText || "#FFF",
      border:`${borderThickness.addToCart || 2}px solid ${
              colors.buttonBorder || themeColor}`,
      borderRadius: radius(shapes.addToCart),
      cursor:"pointer",
    },
    badge: {
      position:"absolute", top:"-9px", right:"30px",
      padding:"2px 10px", borderRadius:"4px",
      fontSize:`${typography.highlight?.size || 10.5}px`,
      fontWeight: fw(typography.highlight?.fontStyle),
      color: colors.highlightText || "#FFF",
      background: colors.highlightBackground || themeColor,
      border: highlightStyle === "outline" ? "1px solid #000" : "none",
      animation: isBlinking ? "blink 1s infinite" : "none",
    },
    timerWrap:{ display:"flex", flexDirection:"column", alignItems:"center" },
    timerText:{ marginBottom:"5px" },
    timerDigits:{ fontWeight:"bold",
      fontSize:`${parseInt(typography.highlight?.size || 10.5,10)+2}px` },
  };

  /* -------------------------------------------------------------- */
  /*  Small render helpers                                          */
  /* -------------------------------------------------------------- */
  const Highlight = () =>
    highlightOption === "none" ? null :
    highlightOption === "text" ? (
      <div style={css.badge}>{highlightTitle}</div>
    ) : (
      <div style={css.badge}>
        <div style={css.timerWrap}>
          <div style={{...css.timerText,...css.badge}}>{highlightTimerTitle}</div>
          <div style={{...css.timerDigits,...css.badge,fontWeight:"bold"}}>
            {timerFormat === "dd:hh:mm:ss" ? "01:23:45:67" : "23:45:67"}
          </div>
        </div>
      </div>
    );

  const Products = () =>
    products.flatMap((p, i) => [
      <div key={`p-${p.id}`} style={css.product}>
        <img src={p.image} alt={p.name} style={css.img} />
        <div style={{ flex:1 }}>
          <div style={css.title}>{p.name}</div>
          {settings.showPrices && (
            <div style={css.price}>
              $19.99
              {settings.showComparePrice && (
                <span style={css.compare}>$29.99</span>
              )}
            </div>
          )}
          <div style={css.qtyBox}>
            <span style={css.qty}>x{p.quantity}</span>
          </div>
        </div>
      </div>,
      i < products.length - 1 ? (
        <div key={`plus-${i}`} style={css.plus}>+</div>
      ) : null,
    ]);

  /* -------------------------------------------------------------- */
  /*  JSX                                                           */
  /* -------------------------------------------------------------- */
  return (
    <Card title="Live Preview">
      <div style={css.container} className={`template-${selectedTemplate}`}>
        {headerText && (
          <div style={css.header}>
            <div style={css.headerTitle}>{headerText}</div>
            <span role="img" aria-label="cart">🛒</span>
          </div>
        )}

        <div style={css.bodyWrap}><Products /></div>

        <div style={css.footer}>
          <Highlight />
          <div style={css.footerText}>
            {footerText} <span style={{ color:"#000" }}>$59.97</span>
          </div>
        </div>

        <button type="button" style={css.button}>{buttonText}</button>
      </div>
    </Card>
  );
}
