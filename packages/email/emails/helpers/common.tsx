import { Head, Html } from "@react-email/components";
import { Font } from "@react-email/font";
import { pixelBasedPreset, Tailwind } from "@react-email/tailwind";

type TCommonProps = {
  children: React.ReactNode;
};

const Common = ({ children }: TCommonProps) => {
  return (
    <Html>
      <Head />
      <Font
        fontFamily="Noto Sans"
        fallbackFontFamily="Verdana"
        fontWeight={400}
        fontStyle="normal"
      />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        {children}
      </Tailwind>
    </Html>
  );
};

export { Common };
