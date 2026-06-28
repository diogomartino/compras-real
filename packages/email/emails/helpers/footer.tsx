import { Section, Text } from "@react-email/components";

const Footer = () => {
  return (
    <Section className="flex justify-center mt-12">
      <Text className="text-xs text-gray-400 leading-[15px] text-center mb-12">
        ©{new Date().getFullYear()} MyApp. All rights reserved.
      </Text>
    </Section>
  );
};

export { Footer };
