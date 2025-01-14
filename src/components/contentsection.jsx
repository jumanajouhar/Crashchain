function ContentSection() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0 text-center">
      <div id = "about" className="mx-auto max-w-2xl">
        {/* About Us Section */}
        <p className="text-base font-semibold leading-7 text-indigo-600">About Us</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Pioneers in Blockchain-Based Accident Forensics
        </h1>
        <p className="mt-6 text-xl leading-8 text-gray-700">
          We specialize in providing state-of-the-art digital forensic solutions for vehicle accident investigations
          using blockchain technology. Our secure, immutable data handling ensures that investigations remain
          transparent, verifiable, and trustworthy.
        </p>
      </div>

      {/* Meet the Team Section */}
      <div id="meet-the-team" className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mx-auto max-w-7xl">
          {/* Team members */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">JOBIN TOM</h3>
            <p className="text-gray-600">A technology enthusiast dedicated to enhancing digital forensic solutions through blockchain and innovative web development.</p>
            <div className="flex justify-center mt-4">
              <a href="https://github.com/jobint001">
                <img src="src/assets/github.png" alt="github" width="40" height="40" className="mx-2" />
              </a>
              <a href="https://www.linkedin.com/in/jobintomofficial">
                <img src="src/assets/image.png" alt="linkedin" width="40" height="40" className="mx-2" />
              </a>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">MUHAMED ADIL</h3>
            <p className="text-gray-600">A passionate computer science student with expertise in web development, eager to leverage technology to improve forensic investigations.</p>
            <div className="flex justify-center mt-4">
              <a href="https://github.com/adilzubair">
                <img src="src/assets/github.png" alt="github" width="40" height="40" className="mx-2" />
              </a>
              <a href="https://www.linkedin.com/in/muhamedadil">
                <img src="src/assets/image.png" alt="linkedin" width="40" height="40" className="mx-2" />
              </a>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">JUMANA JOUHAR</h3>
            <p className="text-gray-600">A dedicated learner, committed to applying innovative solutions that enhance the accuracy and efficiency of forensic investigations.</p>
            <div className="flex justify-center mt-4">
              <a href="https://github.com/jumanajouhar">
                <img src="src/assets/github.png" alt="github" width="40" height="40" className="mx-2" />
              </a>
              <a href="https://www.linkedin.com/in/jumana-jouhar">
                <img src="src/assets/image.png" alt="linkedin" width="40" height="40" className="mx-2" />
              </a>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">JIYA MARY JOBY</h3>
            <p className="text-gray-600">An aspiring web developer, committed to creating intuitive applications that support blockchain-based forensic solutions.</p>
            <div className="flex justify-center mt-4">
              <a href="https://github.com/jiya42">
                <img src="src/assets/github.png" alt="github" width="40" height="40" className="mx-2" />
              </a>
              <a href="https://www.linkedin.com/in/jiya-mary-joby">
                <img src="src/assets/image.png" alt="linkedin" width="40" height="40" className="mx-2" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement Section */}
      <div id = "values" className="mx-auto max-w-2xl mt-12">
        <p className="text-base font-semibold leading-7 text-indigo-600">Mission Statement</p>
        <p className="mt-6 text-xl leading-8 text-gray-700">
          Our mission is to revolutionize accident forensics by leveraging blockchain and advanced data analysis to
          ensure transparency and accuracy in investigations. We aim to provide unparalleled insights and secure,
          tamper-proof solutions to our clients in the forensic and automotive industries.
        </p>
      </div>

      {/* Core Values Section */}
      <div className="mx-auto max-w-2xl mt-12">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Core Values</h1>
        <ul role="list" className="mt-8 space-y-8 text-gray-600">
          <li className="flex justify-center">
            <span>
              <h3 className="font-semibold text-gray-900 inline-block">Innovation:</h3> We are committed to
              staying ahead of the curve in blockchain and web development trends, ensuring our clients benefit
              from the latest advancements.
            </span>
          </li>
          <li className="flex justify-center">
            <span>
              <h3 className="font-semibold text-gray-900 inline-block">Quality:</h3> We believe in delivering
              high-quality solutions that are not only functional and reliable but also visually appealing and
              user-friendly.
            </span>
          </li>
          <li className="flex justify-center">
            <span>
              <h3 className="font-semibold text-gray-900 inline-block">Customer-Centric Approach:</h3> Our clients
              are at the heart of everything we do. We prioritize understanding their unique needs and goals to
              deliver personalized solutions that drive success.
            </span>
          </li>
          <li className="flex justify-center">
            <span>
              <h3 className="font-semibold text-gray-900 inline-block">Integrity:</h3> We uphold the highest
              standards of integrity in all our interactions, fostering trust and transparency with our clients
              and partners.
            </span>
          </li>
          <li className="flex justify-center">
            <span>
              <h3 className="font-semibold text-gray-900 inline-block">Collaboration:</h3> We value
              collaboration both internally and with our clients, believing that teamwork and open communication
              are essential to achieving exceptional results.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ContentSection;