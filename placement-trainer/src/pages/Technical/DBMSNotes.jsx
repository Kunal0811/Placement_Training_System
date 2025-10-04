// src/pages/Technical/DBMSNotes.jsx
export default function DBMSNotes() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Database Management Systems (DBMS)</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Core Relational Database Concepts</h2>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
          <li><b>ACID Properties:</b> A set of properties that guarantee database transactions are processed reliably.
            <ul className="list-circle pl-6">
                <li><b>Atomicity:</b> Transactions are all-or-nothing.</li>
                <li><b>Consistency:</b> A transaction brings the database from one valid state to another.</li>
                <li><b>Isolation:</b> Concurrent transactions produce the same result as sequential transactions.</li>
                <li><b>Durability:</b> Once a transaction is committed, it will remain so.</li>
            </ul>
          </li>
          <li><b>Normalization:</b> The process of organizing data in a database to reduce redundancy and improve data integrity. The most common forms are 1NF, 2NF, 3NF, and BCNF.</li>
          <li><b>SQL (Structured Query Language):</b> The standard language for managing and manipulating relational databases. Key operations include:
            <ul className="list-circle pl-6">
                <li><b>DDL (Data Definition Language):</b> `CREATE`, `ALTER`, `DROP` tables.</li>
                <li><b>DML (Data Manipulation Language):</b> `SELECT`, `INSERT`, `UPDATE`, `DELETE` data.</li>
                <li><b>Joins:</b> `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN` to combine rows from two or more tables based on a related column.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Advanced Topics</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
          <li><b>Indexing:</b> Special lookup tables that the database search engine can use to speed up data retrieval. Think of it like the index in the back of a book.</li>
          <li><b>Transactions and Concurrency Control:</b> Managing simultaneous operations on a database without them interfering with each other.</li>
          <li><b>NoSQL Databases:</b> A different paradigm from relational databases, often used for big data and real-time web apps (e.g., MongoDB, Cassandra). They are non-tabular and store data differently.</li>
        </ul>
      </section>
    </div>
  );
}