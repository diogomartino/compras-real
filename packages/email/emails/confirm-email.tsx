import {
  Body,
  Container,
  Heading,
  Preview,
  Section,
  Text
} from "@react-email/components";
import { Common } from "./helpers/common";
import { Footer } from "./helpers/footer";
import { Logo } from "./helpers/logo";
import type { TConfirmEmailProps } from "../types";

const ConfirmEmail = ({ validationCode }: TConfirmEmailProps) => (
  <Common>
    <Body className="bg-background font-sans mx-auto my-0">
      <Preview>Confirm your email address</Preview>

      <Container className="mx-auto my-0 py-0 px-5">
        <Logo />

        <Heading className="text-4xl mb-6 font-bold mx-0 p-0 text-center">
          Confirm your email address
        </Heading>

        <Section>
          <Text className="text-base leading-7 text-center">
            Please use the following code to confirm your email address:
          </Text>
        </Section>

        <Section className="bg-gray-100 border border-gray-300 rounded-2xl py-10 px-3">
          <Text className="text-3xl font-semibold text-center">
            {validationCode}
          </Text>
        </Section>

        <Section className="flex justify-center">
          <Text className="text-center">
            If you didn’t request this email, you can safely ignore it.
          </Text>
        </Section>

        <Footer />
      </Container>
    </Body>
  </Common>
);

ConfirmEmail.PreviewProps = {
  validationCode: "123456",
} as TConfirmEmailProps;

export default ConfirmEmail;
export { ConfirmEmail };
