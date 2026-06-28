import { Img, Link, Section } from "@react-email/components";
import { getUrl } from "./get-url";

const Logo = () => {
  return (
    <Section className="mt-8 flex justify-center">
      <Link href={getUrl()}>
        <Img
          src={`${process.env.BASE_URL ?? ""}/static/logo.png`}
          width="120"
          height="36"
          alt="MyApp"
        />
      </Link>
    </Section>
  );
};

export { Logo };
