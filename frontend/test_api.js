async function testApi() {
  const baseUrl = 'http://localhost:8080/api';

  // 1. Register a test user
  const regEmail = `test_${Date.now()}@example.com`;
  let res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: regEmail, password: 'password123' })
  });
  let data = await res.json();
  const token = data.accessToken;

  // 2. Create a task
  res = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ title: 'Test Task', description: 'Desc', priority: 'HIGH', forWhen: 'TODAY' })
  });
  let task = await res.json();
  console.log("--- Created Task ---");
  console.log(task);

  // 3. Start task
  res = await fetch(`${baseUrl}/tasks/${task.id}/start`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  task = await res.json();
  console.log("--- Started Task ---");
  console.log(task);

  // 4. Finish task
  res = await fetch(`${baseUrl}/tasks/${task.id}/finish`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ taskNote: 'Done' })
  });
  task = await res.json();
  console.log("--- Finished Task ---");
  console.log(task);
}

testApi().catch(console.error);
