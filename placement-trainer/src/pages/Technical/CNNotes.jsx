// src/pages/Technical/CNNotes.jsx
export default function CNNotes() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Computer Networks (CN) Notes</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">OSI & TCP/IP Models</h2>
        <p className="text-gray-700 leading-relaxed mb-2">These models provide a framework for understanding how different networking protocols and devices interact to provide network connectivity.</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
            <li><b>OSI Model (7 Layers):</b> A conceptual model that characterizes the communication functions of a telecommunication or computing system. Layers include Physical, Data Link, Network, Transport, Session, Presentation, and Application.</li>
            <li><b>TCP/IP Model (4 Layers):</b> A more practical model that is used for the internet. Its layers are Network Interface, Internet, Transport, and Application.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Key Protocols</h2>
        <p className="text-gray-700 leading-relaxed mb-2">Protocols are sets of rules that govern how data is formatted, transmitted, and received.</p>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
          <li><b>HTTP/HTTPS:</b> The foundation of the World Wide Web. HTTPS is the secure version, encrypting data between the client and server.</li>
          <li><b>TCP (Transmission Control Protocol):</b> A connection-oriented protocol that provides reliable, ordered, and error-checked delivery of a stream of bytes. Used for web browsing, email, and file transfers.</li>
          <li><b>UDP (User Datagram Protocol):</b> A connectionless protocol that is faster than TCP but does not guarantee delivery. Used for streaming video, online gaming, and DNS.</li>
          <li><b>IP (Internet Protocol):</b> Responsible for addressing and routing packets of data so they can travel across networks and arrive at the correct destination.</li>
          <li><b>DNS (Domain Name System):</b> Translates human-readable domain names (like www.google.com) into machine-readable IP addresses.</li>
        </ul>
      </section>
    </div>
  );
}