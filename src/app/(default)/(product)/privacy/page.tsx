import type { Metadata } from "next";
import Link from "next/link";

import { Box, Container, Typography } from "@mui/material";


export default function PrivacyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box pb={3}>
        <Typography variant="h1">Privacy Policy</Typography>
        <Typography variant="caption" component="p">Updated: Feb 7, 2024</Typography>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          This privacy notice for Loop Mapping (&quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; or &quot;<strong>our</strong>&quot;), describes how and why we might collect, store, use, and/or share (&quot;<strong>process</strong>&quot;) your information when you use our services (&quot;<strong>Services</strong>&quot;), such as when you:
        </Typography>

        <Box component="ul">
          <Typography variant="body2" component="li">
            Visit our website at <Link href="https://main.d221qkpqwpwj6d.amplifyapp.com" target="_blank">https://main.d221qkpqwpwj6d.amplifyapp.com</Link>, or any website of ours that links to this privacy notice
          </Typography>

          <Typography variant="body2" component="li">
            Engage with us in other related ways, including any sales, marketing, or events
          </Typography>
        </Box>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          <strong>Questions or concerns?</strong> Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at loopmapping@gmail.com.
        </Typography>
      </Box>

      <Box pt={3} pb={1}><Typography variant="h2">Summary of key points</Typography></Box>

      <Box py={1}>
        <Typography variant="body1">
          <strong><em>This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our <Link href="#toc">table of contents</Link> below to find the section you are looking for.</em></strong>
        </Typography>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          <strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about <Link href="#personalinfo">personal information you disclose to us</Link>.
        </Typography>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          <strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.
        </Typography>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          <strong>Do we receive any information from third parties?</strong> We do not receive any information from third parties.
        </Typography>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          <strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about <Link href="#infouse">how we process your information</Link>.
        </Typography>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          <strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties. Learn more about <Link href="#whoshare">when and with whom we share your personal information</Link>.
        </Typography>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          <strong>How do we keep your information safe?</strong> We have organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about <Link href="#infosafe">how we keep your information safe</Link>.
        </Typography>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          <strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about <Link href="#privacyrights">your privacy rights</Link>.
        </Typography>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          <strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by submitting a <Link href="https://app.termly.io/notify/3ae6288d-d039-4618-96e4-53cec85b2d86" rel="noopener noreferrer" target="_blank">data subject access request</Link>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
        </Typography>
      </Box>

      <Box py={1}>
        <Typography variant="body1">
          Want to learn more about what we do with any information we collect? <Link href="#toc">Review the privacy notice in full</Link>.
        </Typography>
      </Box>

      <Box id="toc" pt={3} pb={1}>
        <Typography variant="h2">Table of contents</Typography>
      </Box>

      <Box component="ol" py={1}>
        <Typography variant="h6" component="li">
          <Link href="#infocollect">What information do we collect?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#infouse">How do we process your information?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#legalbases">What legal bases to we rely on tp process your personal information?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#whoshare">When and with whom do we share your personal information?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#3pwebsites">What is our stance on third-party websites?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#cookies">Do we use cookies and other tracking technologies?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#sociallogins">How do we handle your social logins?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#inforetain">How long do we keep your information?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#infosafe">How do we keep your information safe?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#infominors">Do we collect information from minors?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#privacyrights">What are your privacy rights?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#DNT">Controls for do-not-track features</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#uslaws">Do United States residents have specific privacy rights?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#policyupdates">Do we make updates to this notice?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#contact">How can you contact us about this notice?</Link>
        </Typography>

        <Typography variant="h6" component="li">
          <Link href="#request">How can you review, update, or delete the data we collect from you?</Link>
        </Typography>
      </Box>

      <Box id="infocollect" py={2}>
        <Typography id="control" variant="h3">
          1. What information do we collect?
        </Typography>

        <Box id="personalinfo" py={1}>
          <Typography variant="h4">Personal information you disclose to us</Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> We collect personal information that you provide to us.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
          </Typography>

          <Box component="ul">
            <Typography variant="body2" component="li">names</Typography>
            <Typography variant="body2" component="li">email addresses</Typography>
            <Typography variant="body2" component="li">passwords</Typography>
            <Typography variant="body2" component="li" >contact or authentication data</Typography>
          </Box>
        </Box>

        <Box id="sensitiveinfo" py={1}>
          <Typography variant="body1">
            <strong>Sensitive Information.</strong> We do not process sensitive information.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            <strong>Payment Data.</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by Stripe. You may find their privacy notice link(s) here: <Link href="http://www.stripe.com/privacy" target="_blank">http://www.stripe.com/privacy</Link>.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            <strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called &quot;<Link href="#sociallogins">How do we handle your social logins?</Link>&quot; below.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="h4">
            Information automatically collected
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            Like many businesses, we also collect information through cookies and similar technologies.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">The information we collect includes:</Typography>

          <Box component="ul">
            <Typography variant="body2" component="li">
              <em>Log and Usage Data.</em> Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called &quot;crash dumps&quot;), and hardware settings).
            </Typography>

            <Typography variant="body2" component="li">
              <em>Device Data.</em> We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.
            </Typography>

            <Typography variant="body2" component="li">
              <em>Location Data.</em> We collect location data such as information about your device&apos;s location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box id="infouse" py={2}>
        <Typography id="control" variant="h3">2. How do we process your information?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</Typography>

          <Box component="ul">
            <Typography variant="body2" component="li">
              <strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.
            </Typography>

            <Typography variant="body2" component="li">
              <strong>To deliver targeted advertising to you.</strong> We may process your information to develop and display personalized content and advertising tailored to your interests, location, and more.
            </Typography>

            <Typography variant="body2" component="li">
              <strong>To identify usage trends.</strong> We may process information about how you use our Services to better understand how they are being used so we can improve them.
            </Typography>

            <Typography variant="body2" component="li">
              <strong>To save or protect an individual&apos;s vital interest.</strong> We may process your information when necessary to save or protect an individual&apos;s vital interest, such as to prevent harm.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box id="legalbases" py={2}>
        <Typography variant="h3">3. What legal bases do we rely on to process your information?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="h4">If you are located in the EU or UK, this section applies to you.</Typography>

          <Box py={1}>
            <Typography variant="body1">
              The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:
            </Typography>

            <Box component="ul">
              <Typography variant="body2" component="li">
                <strong>Consent.</strong> We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about <Link href="#withdrawconsent">withdrawing your consent</Link>.
              </Typography>

              <Typography variant="body2" component="li">
                <strong>Legitimate Interests.</strong> We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:
              </Typography>

              <Box component="ul">
                <Typography variant="body2" component="li">
                  Develop and display personalized and relevant advertising content for our users
                </Typography>

                <Typography variant="body2" component="li">
                  Analyze how our Services are used so we can improve them to engage and retain users
                </Typography>
              </Box>

              <Typography variant="body2" component="li">
                <strong>Legal Obligations.</strong> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.
              </Typography>

              <Typography variant="body2" component="li">
                <strong>Vital Interests.</strong> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">If you are located in Canada, this section applies to you.</Typography>

          <Box py={1}>
            <Typography variant="body1">
              We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can <Link href="#withdrawconsent">withdraw your consent</Link> at any time.
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:
            </Typography>

            <Box component="ul">
              <Typography variant="body2" component="li">If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</Typography>

              <Typography variant="body2" component="li">For investigations and fraud detection and prevention</Typography>

              <Typography variant="body2" component="li">For business transactions provided certain conditions are met</Typography>

              <Typography variant="body2" component="li">If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</Typography>

              <Typography variant="body2" component="li">For identifying injured, ill, or deceased persons and communicating with next of kin</Typography>

              <Typography variant="body2" component="li">If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</Typography>

              <Typography variant="body2" component="li">If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province</Typography>

              <Typography variant="body2" component="li">If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</Typography>

              <Typography variant="body2" component="li">If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</Typography>

              <Typography variant="body2" component="li">If the collection is solely for journalistic, artistic, or literary purposes</Typography>

              <Typography variant="body2" component="li">If the information is publicly available and is specified by the regulations</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box id="whoshare" py={2}>
        <Typography id="control" variant="h3">4. When and with whom do we share your personal information?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> We may share information in specific situations described in this section and/or with the following third parties.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">We may need to share your personal information in the following situations:</Typography>

          <Box component="ul">
            <Typography variant="body2" component="li">
              <strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
            </Typography>

            <Typography variant="body2" component="li">
              <strong>When we use Google Analytics.</strong> We may share your information with Google Analytics to track and analyze the use of the Services. To opt out of being tracked by Google Analytics across the Services, visit <Link href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer" target="_blank">https://tools.google.com/dlpage/gaoptout</Link>. For more information on the privacy practices of Google, please visit the <Link href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">Google Privacy & Terms page</Link>.
            </Typography>

            <Typography variant="body2" component="li">
              <strong>When we use Google Maps Platform APIs.</strong> We may share your information with certain Google Maps Platform APIs (e.g., Google Maps API, Places API). We obtain and store on your device (&quot;cache&quot;) your location. You may revoke your consent anytime by contacting us at the contact details provided at the end of this document.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box id="3pwebsites" py={2}>
        <Typography variant="h3">5. What is our stance on third-party websites?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            The Services may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us and which may link to other websites, services, or applications. Accordingly, we do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such third-party websites, services, or applications. The inclusion of a link towards a third-party website, service, or application does not imply an endorsement by us. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy notice. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services, or applications that may be linked to or from the Services. You should review the policies of such third parties and contact them directly to respond to your questions.
          </Typography>
        </Box>
      </Box>

      <Box id="cookies" py={2}>
        <Typography id="control" variant="h3">6. Do we use cookies and other tracking technologies?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
          </Typography>
        </Box>
      </Box>

      <Box id="sociallogins" py={2}>
        <Typography id="control" variant="h3">7. How do we handle your social logins?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.
          </Typography>
        </Box>
      </Box>

      <Box id="inforetain" py={2}>
        <Typography id="control" variant="h3">8. How long do we keep your information?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
          </Typography>
        </Box>
      </Box>

      <Box id="infosafe" py={2}>
        <Typography id="control" variant="h3">9. How do we keep your information safe?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
          </Typography>
        </Box>
      </Box>

      <Box id="infominors" py={2}>
        <Typography id="control" variant="h3">10. Do we collect information from minors?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> We do not knowingly collect data from or market to children under 18 years of age.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent&apos;s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at loopmapping@gmail.com.
          </Typography>
        </Box>
      </Box>

      <Box id="privacyrights" py={2}>
        <Typography id="control" variant="h3">11. What are your privacy rights?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> In some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section &quot;<Link href="#contact">How can you contact us about this notice?</Link>&quot; below.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            We will consider and act upon any request in accordance with applicable data protection laws.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your <Link href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm" rel="noopener noreferrer" target="_blank">Member State data protection authority</Link> or <Link href="https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/" rel="noopener noreferrer" target="_blank">UK data protection authority</Link>.
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            If you are located in Switzerland, you may contact the <Link href="https://www.edoeb.admin.ch/edoeb/en/home.html" rel="noopener noreferrer" target="_blank">Federal Data Protection and Information Commissioner</Link>.
          </Typography>
        </Box>

        <Box id="withdrawconsent" py={1}>
          <Typography variant="h4">Withdrawing your consent</Typography>

          <Box py={1}>
            <Typography variant="body1">
              If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section &quot;<Link href="#contact">How can you contact us about this notice?</Link>&quot; below.
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
            </Typography>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">
            Opting out of marketing and promotional communications
          </Typography>

          <Box py={1}>
            <Typography variant="body1">
              You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section &quot;<Link href="#contact">How can you contact us about this notice?</Link>&quot; below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.
            </Typography>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">Account Information</Typography>

          <Box py={1}>
            <Typography variant="body1">
              If you would at any time like to review or change the information in your account or terminate your account, you can:
            </Typography>

            <Box component="ul">
              <Typography variant="body2" component="li">Log in to your account settings and update your user account.</Typography>
            </Box>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
            </Typography>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">
            Cookies and similar technologies
          </Typography>

          <Box py={1}>
            <Typography variant="body1">
              Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. You may also <Link href="http://www.aboutads.info/choices/" rel="noopener noreferrer" target="_blank">opt out of interest-based advertising by advertisers</Link> on our Services.
            </Typography>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            If you have questions or comments about your privacy rights, you may email us at loopmapping@gmail.com.
          </Typography>
        </Box>
      </Box>

      <Box id="DNT" py={2}>
        <Typography id="control" variant="h3">12. Controls for do-not-track features</Typography>

        <Box py={1}>
          <Typography variant="body1">
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&quot;DNT&quot;) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.
          </Typography>
        </Box>
      </Box>

      <Box id="uslaws" py={2}>
        <Typography id="control" variant="h3">13. Do Unites States residents have specific privacy rights?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> If you are a resident of California, Colorado, Connecticut, Utah or Virginia, you are granted specific rights regarding access to your personal information.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="h4">What categories of personal information do we collect?</Typography>

          <Box py={1}>
            <Typography variant="body1">
              We have collected the following categories of personal information in the past twelve (12) months:
            </Typography>
          </Box>

          <table>
            <tbody>
              <tr>
                <td><Typography variant="body1">Category</Typography></td>
                <td><Typography variant="body1">Examples</Typography></td>
                <td><Typography variant="body1">Collected</Typography></td>
              </tr>
              <tr>
                <td>
                  <Typography variant="body2">A. Identifiers</Typography>
                </td>
                <td>
                  <Typography variant="body2">
                    Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">Yes</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">
                    B. Personal information as defined in the California Customer Records statute
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">
                    Name, contact information, education, employment, employment history, and financial information
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">Yes</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">
                    C. Protected classification characteristics under state or federal law
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">Gender and date of birth</Typography>
                </td>
                <td>
                  <Typography variant="body2">No</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">D. Commercial information</Typography>
                </td>
                <td >
                  <Typography variant="body2">
                    Transaction information, purchase history, financial details, and payment information
                  </Typography>
                </td>
                <td >
                  <Typography variant="body2">No</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">E. Biometric information</Typography>
                </td>
                <td>
                  <Typography variant="body2">Fingerprints and voiceprints</Typography>
                </td>
                <td>
                  <Typography variant="body2">No</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">
                    F. Internet or other similar network activity
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">
                    Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">No</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">G. Geolocation data</Typography>
                </td>
                <td>
                  <Typography variant="body2">Device location</Typography>
                </td>
                <td>
                  <Typography variant="body2">No</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">
                    H. Audio, electronic, visual, thermal, olfactory, or similar information
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">
                    Images and audio, video or call recordings created in connection with our business activities
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">No</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">
                    I. Professional or employment-related information
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">
                    Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">No</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">J. Education Information</Typography>
                </td>
                <td>
                  <Typography variant="body2">Student records and directory information</Typography>
                </td>
                <td>
                  <Typography variant="body2">No</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">
                    K. Inferences drawn from collected personal information
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">
                    Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual&apos;s preferences and characteristics
                  </Typography>
                </td>
                <td>
                  <Typography variant="body2">No</Typography>
                </td>
              </tr>

              <tr>
                <td>
                  <Typography variant="body2">L. Sensitive personal Information</Typography>
                </td>
                <td></td>
                <td>
                  <Typography variant="body2">No</Typography>
                </td>
              </tr>
            </tbody>
          </table>

          <Box py={1}>
            <Typography variant="body1">
              We will use and retain the collected personal information as needed to provide the Services or for:
            </Typography>

            <Box component="ul">
              <Typography variant="body2" component="li">
                Category A - As long as the user has an account with us
              </Typography>

              <Typography variant="body2" component="li">
                Category B - As long as the user has an account with us
              </Typography>
            </Box>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:
            </Typography>

            <Box component="ul">
              <Typography variant="body2" component="li">
                Receiving help through our customer support channels;
              </Typography>

              <Typography variant="body2" component="li">
                Participation in customer surveys or contests; and
              </Typography>

              <Typography variant="body2" component="li">
                Facilitation in the delivery of our Services and to respond to your inquiries.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">How do we use and share your personal information?</Typography>

          <Box py={1}>
            <Typography variant="body1">
              Learn about how we use your personal information in the section, &quot;<Link href="#infouse">How do we process your information?</Link>&quot;
            </Typography>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">Will your information be shared with anyone else?</Typography>

          <Box py={1}>
            <Typography variant="body1">
              We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, &quot;<Link href="#whoshare">When and with whom do we share your presonal information?</Link>&quot;
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be &quot;selling&quot; of your personal information.
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.
            </Typography>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">California Residents</Typography>

          <Box py={1}>
            <Typography variant="body1">
              California Civil Code Section 1798.83, also known as the &quot;Shine The Light&quot; law permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              If you are under 18 years of age, reside in California, and have a registered account with the Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g., backups, etc.).
            </Typography>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">CCPA Privacy Notice</Typography>

          <Box py={1}>
            <Typography variant="body1">
              This section applies only to California residents. Under the California Consumer Privacy Act (CCPA), you have the rights listed below.
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              The California Code of Regulations defines a &quot;resident&quot; as:
            </Typography>

            <Box component="ol">
              <Typography variant="body2" component="li">
                every individual who is in the State of California for other than a temporary or transitory purpose and
              </Typography>

              <Typography variant="body2" component="li">
                every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose
              </Typography>
            </Box>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              All other individuals are defined as &quot;non-residents.&quot;
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              If this definition of &quot;resident&quot; applies to you, we must adhere to certain rights and obligations regarding your personal information.
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="h5">
              Your rights with respect to your personal data
            </Typography>

            <Box py={1}>
              <Typography variant="h6">
                Right to request deletion of the data — Request to delete
              </Typography>

              <Box py={1}>
                <Typography variant="body1">
                  You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any processing that may be required to protect against illegal activities.
                </Typography>
              </Box>
            </Box>

            <Box py={1}>
              <Typography variant="h6">
                Right to be informed — Request to know
              </Typography>

              <Box py={1}>
                <Typography variant="body1">
                  Depending on the circumstances, you have a right to know:
                </Typography>

                <Box component="ul">
                  <Typography variant="body2" component="li">
                    whether we collect and use your personal information;
                  </Typography>

                  <Typography variant="body2" component="li">
                    the categories of personal information that we collect;
                  </Typography>

                  <Typography variant="body2" component="li">
                    the purposes for which the collected personal information is used;
                  </Typography>

                  <Typography variant="body2" component="li">
                    whether we sell or share personal information to third parties;
                  </Typography>

                  <Typography variant="body2" component="li">
                    the categories of personal information that we sold, shared, or disclosed for a business purpose;
                  </Typography>

                  <Typography variant="body2" component="li">
                    the categories of third parties to whom the personal information was sold, shared, or disclosed for a business purpose;
                  </Typography>

                  <Typography variant="body2" component="li">
                    the business or commercial purpose for collecting, selling, or sharing personal information; and
                  </Typography>

                  <Typography variant="body2" component="li">
                    the specific pieces of personal information we collected about you.
                  </Typography>
                </Box>

                <Box py={1}>
                  <Typography variant="body1">
                    In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box py={1}>
              <Typography variant="h6">
                Right to Non-Discrimination for the Exercise of a Consumer&apos;s Privacy Rights
              </Typography>

              <Box py={1}>
                <Typography variant="body1">
                  We will not discriminate against you if you exercise your privacy rights.
                </Typography>
              </Box>
            </Box>

            <Box py={1}>
              <Typography variant="h6">
                Right to Limit Use and Disclosure of Sensitive Personal Information
              </Typography>

              <Box py={1}>
                <Typography variant="body1">
                  We do not process consumer&apos;s sensitive personal information.
                </Typography>
              </Box>
            </Box>

            <Box py={1}>
              <Typography variant="h6">Verification process</Typography>

              <Box py={1}>
                <Typography variant="body1">
                  Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g., phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate.
                </Typography>
              </Box>

              <Box py={1}>
                <Typography variant="body1">
                  We will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such additionally provided information as soon as we finish verifying you.
                </Typography>
              </Box>
            </Box>

            <Box py={1}>
              <Typography variant="h6">Other privacy Rights</Typography>

              <Box py={1} component="ul">
                <Typography variant="body1" component="li">
                  You may object to the processing of your personal information.
                </Typography>

                <Typography variant="body1" component="li">
                  You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the information.
                </Typography>

                <Typography variant="body1" component="li">
                  You can designate an authorized agent to make a request under the CCPA on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with the CCPA.
                </Typography>

                <Typography variant="body1" component="li">
                  You may request to opt out from future selling or sharing of your personal information to third parties. Upon receiving an opt-out request, we will act upon the request as soon as feasibly possible, but no later than fifteen (15) days from the date of the request submission.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              To exercise these rights, you can contact us by submitting a <Link href="https://app.termly.io/notify/3ae6288d-d039-4618-96e4-53cec85b2d86" rel="noopener noreferrer" target="_blank">data subject access request</Link> by email at loopmapping@gmail.com, or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you.
            </Typography>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">Colorado Residents</Typography>

          <Box py={1}>
            <Typography variant="body1">
              This section applies only to Colorado residents. Under the Colorado Privacy Act (CPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.
            </Typography>
          </Box>

          <Box py={1} component="ul">
            <Typography variant="body1" component="li">
              Right to be informed whether or not we are processing your personal data
            </Typography>

            <Typography variant="body1" component="li">
              Right to access your personal data
            </Typography>

            <Typography variant="body1" component="li">
              Right to correct inaccuracies in your personal data
            </Typography>

            <Typography variant="body1" component="li">
              Right to request deletion of your personal data
            </Typography>

            <Typography variant="body1" component="li">
              Right to obtain a copy of the personal data you previously shared with us
            </Typography>

            <Typography variant="body1" component="li">
              Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (&quot;profiling&quot;)
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              To submit a request to exercise these rights described above, please email loopmapping@gmail.com or submit a <Link href="https://app.termly.io/notify/3ae6288d-d039-4618-96e4-53cec85b2d86" rel="noopener noreferrer" target="_blank">data subject access request</Link>.
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              If we decline to take action regarding your request and you wish to appeal our decision, please email us at loopmapping@gmail.com. Within forty-five (45) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions.
            </Typography>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">Connecticut Residents</Typography>

          <Box py={1}>
            <Typography variant="body1">
              This section applies only to Connecticut residents. Under the Connecticut Data Privacy Act (CTDPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.
            </Typography>

            <Box component="ul">
              <Typography variant="body1" component="li">
                Right to be informed whether or not we are processing your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to access your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to correct inaccuracies in your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to request deletion of your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to obtain a copy of the personal data you previously shared with us
              </Typography>

              <Typography variant="body1" component="li">
                Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (&quot;profiling&quot;)
              </Typography>
            </Box>

            <Box py={1}>
              <Typography variant="body1">
                To submit a request to exercise these rights described above, please email loopmapping@gmail.com or submit a <Link href="https://app.termly.io/notify/3ae6288d-d039-4618-96e4-53cec85b2d86" rel="noopener noreferrer" target="_blank">data subject access request</Link>.
              </Typography>
            </Box>

            <Box py={1}>
              <Typography variant="body1">
                If we decline to take action regarding your request and you wish to appeal our decision, please email us at loopmapping@gmail.com. Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">Utah Residents</Typography>

          <Box py={1}>
            <Typography variant="body1">
              This section applies only to Utah residents. Under the Utah Consumer Privacy Act (UCPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.
            </Typography>

            <Box py={1} component="ul">
              <Typography variant="body1" component="li">
                Right to be informed whether or not we are processing your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to access your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to request deletion of your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to obtain a copy of the personal data you previously shared with us
              </Typography>

              <Typography variant="body1" component="li">
                Right to opt out of the processing of your personal data if it is used for targeted advertising or the sale of personal data
              </Typography>
            </Box>

            <Box py={1}>
              <Typography variant="body1">
                To submit a request to exercise these rights described above, please email loopmapping@gmail.com or submit a <Link href="https://app.termly.io/notify/3ae6288d-d039-4618-96e4-53cec85b2d86" rel="noopener noreferrer" target="_blank">data subject access request</Link>.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box py={1}>
          <Typography variant="h4">Virginia Residents</Typography>

          <Box py={1}>
            <Typography variant="body1">
              Under the Virginia Consumer Data Protection Act (VCDPA):
            </Typography>

            <Box component="ul">
              <Typography variant="body2" component="li">
                &quot;Consumer&quot; means a natural person who is a resident of the Commonwealth acting only in an individual or household context. It does not include a natural person acting in a commercial or employment context.
              </Typography>

              <Typography variant="body2" component="li">
                &quot;Personal data&quot; means any information that is linked or reasonably linkable to an identified or identifiable natural person. &quot;Personal data&quot; does not include de-identified data or publicly available information.
              </Typography>

              <Typography variant="body2" component="li">
                &quot;Sale of personal data&quot; means the exchange of personal data for monetary consideration.
              </Typography>
            </Box>
          </Box>

          <Box py={1}>
            <Typography variant="body1">
              If this definition of &quot;consumer&quot; applies to you, we must adhere to certain rights and obligations regarding your personal data.
            </Typography>
          </Box>

          <Box py={1}>
            <Typography variant="h5">Your rights with respect to your personal data</Typography>

            <Box py={1} component="ul">
              <Typography variant="body1" component="li">
                Right to be informed whether or not we are processing your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to access your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to correct inaccuracies in your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to request deletion of your personal data
              </Typography>

              <Typography variant="body1" component="li">
                Right to obtain a copy of the personal data you previously shared with us
              </Typography>

              <Typography variant="body1" component="li">
                Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (&quot;profiling&quot;)
              </Typography>
            </Box>
          </Box>

          <Box py={1}>
            <Typography variant="h5">Exercise your rights provided under the Virginia VCDPA</Typography>

            <Box py={1}>
              <Typography variant="body1">
                You may contact us by email at loopmapping@gmail.com or submit a <Link href="https://app.termly.io/notify/3ae6288d-d039-4618-96e4-53cec85b2d86" rel="noopener noreferrer" target="_blank">data subject access request</Link>.
              </Typography>
            </Box>

            <Box py={1}>
              <Typography variant="body1">
                If you are using an authorized agent to exercise your rights, we may deny a request if the authorized agent does not submit proof that they have been validly authorized to act on your behalf.
              </Typography>
            </Box>
          </Box>

          <Box py={1}>
            <Typography variant="h5">Verification process</Typography>

            <Box py={1}>
              <Typography variant="body1">
                We may request that you provide additional information reasonably necessary to verify you and your consumer&apos;s request. If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request.
              </Typography>
            </Box>

            <Box py={1}>
              <Typography variant="body1">
                Upon receiving your request, we will respond without undue delay, but in all cases, within forty-five (45) days of receipt. The response period may be extended once by forty-five (45) additional days when reasonably necessary. We will inform you of any such extension within the initial 45-day response period, together with the reason for the extension.
              </Typography>
            </Box>
          </Box>

          <Box py={1}>
            <Typography variant="h5">Right to appeal</Typography>

            <Box py={1}>
              <Typography variant="body1">
                If we decline to take action regarding your request, we will inform you of our decision and reasoning behind it. If you wish to appeal our decision, please email us at loopmapping@gmail.com. Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may contact the <Link href="https://www.oag.state.va.us/consumer-protection/index.php/file-a-complaint" rel="noopener noreferrer" target="_blank">Attorney General to submit a complaint</Link>.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box id="policyupdates" py={2}>
        <Typography id="control" variant="h3">14. Do we make updates to this notice?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            <em><strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
          </Typography>
        </Box>

        <Box py={1}>
          <Typography variant="body1">
            We may update this privacy notice from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
          </Typography>
        </Box>
      </Box>

      <Box id="contact" py={2}>
        <Typography id="control" variant="h3">15. How can you contact us about this notice?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            If you have questions or comments about this notice, you may email us at loopmapping@gmail.com
          </Typography>
        </Box>
      </Box>

      <Box id="request" py={2}>
        <Typography id="control" variant="h3">16. How can you review, update,or delete the data we collect from you?</Typography>

        <Box py={1}>
          <Typography variant="body1">
            Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please fill out and submit a <Link href="https://app.termly.io/notify/3ae6288d-d039-4618-96e4-53cec85b2d86" rel="noopener noreferrer" target="_blank">data subject access request</Link>.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export const metadata: Metadata = {
  title: "Loop Mapping - Privacy Policy",
};