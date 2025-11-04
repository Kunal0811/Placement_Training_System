import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

const NoteSection = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-4 text-neon-blue text-glow">{title}</h2>
    <div className="space-y-4 text-gray-300 leading-relaxed">
      {children}
    </div>
  </section>
);

export default function DBMSNotes() {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto p-8 bg-dark-card rounded-2xl border border-neon-blue/20">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-neon-blue hover:text-white transition-colors"
      >
        <span className="text-2xl mr-2">←</span>
        Back
      </button>
      <h1 className="text-5xl font-bold mb-10 text-center text-white text-glow">Database Management Systems (DBMS)</h1>

      <NoteSection title="Core Relational Database Concepts">
        <ul className="list-disc pl-6 mt-2 space-y-4">
          <li>
            <b>ACID Properties:</b> A set of properties that guarantee database transactions are processed reliably.
            <ul className="list-disc pl-8 mt-2 space-y-1 text-gray-400">
                <li><b>Atomicity:</b> Transactions are all-or-nothing.</li>
                <li><b>Consistency:</b> A transaction brings the database from one valid state to another.</li>
                <li><b>Isolation:</b> Concurrent transactions produce the same result as sequential transactions.</li>
                <li><b>Durability:</b> Once a transaction is committed, it will remain so.</li>
            </ul>
          </li>
          <li><b>Normalization:</b> The process of organizing data in a database to reduce redundancy and improve data integrity. The most common forms are 1NF, 2NF, 3NF, and BCNF.</li>
          <li>
            <b>SQL (Structured Query Language):</b> The standard language for managing and manipulating relational databases. Key operations include:
            <ul className="list-disc pl-8 mt-2 space-y-1 text-gray-400">
                <li><b>DDL (Data Definition Language):</b> `CREATE`, `ALTER`, `DROP` tables.</li>
                <li><b>DML (Data Manipulation Language):</b> `SELECT`, `INSERT`, `UPDATE`, `DELETE` data.</li>
                <li><b>Joins:</b> `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN` to combine rows from two or more tables based on a related column.</li>
            </ul>
          </li>
        </ul>
      </NoteSection>

      <NoteSection title="Advanced Topics">
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li><b>Indexing:</b> Special lookup tables that the database search engine can use to speed up data retrieval. Think of it like the index in the back of a book.</li>
          <li><b>Transactions and Concurrency Control:</b> Managing simultaneous operations on a database without them interfering with each other.</li>
          <li><b>NoSQL Databases:</b> A different paradigm from relational databases, often used for big data and real-time web apps (e.g., MongoDB, Cassandra). They are non-tabular and store data differently.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Video Tutorials">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/NdeeSEknp58"
              title="DBMS Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/l5DCnCzDb8g"
              title="Database Normalization"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </NoteSection>

      <section className="mt-12 pt-8 border-t-2 border-dashed border-neon-pink/20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-neon-pink text-glow">Practice Test</h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Ready to test your knowledge? Take a practice test with AI-generated questions.
        </p>
        <Link
          to={`/technical/modes/Database Management Systems`}
          className="inline-block bg-neon-pink text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform animate-glow"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}