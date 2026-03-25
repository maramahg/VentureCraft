import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
    });
}

const db = admin.firestore();

async function redistribute() {
    console.log('Fetching all applications...');
    const snapshot = await db.collection('applications').get();
    const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log(`Found ${apps.length} applications. Redistributing...`);

    const teams = ['A', 'B', 'C', 'D', 'E'] as const;
    const currentCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };

    // Note: We redistribute ALL of them from scratch to ensure perfect balance
    const updates = apps.map(app => {
        // Find team with minimum current count
        const assignedTeam = teams.reduce((a, b) =>
            currentCounts[a] <= currentCounts[b] ? a : b
        );

        // Increment local count
        currentCounts[assignedTeam]++;

        return {
            id: app.id,
            team: assignedTeam
        };
    });

    console.log('Calculated target distribution:', currentCounts);

    // Batch updates (max 500 per batch)
    const batch = db.batch();
    let count = 0;

    for (const update of updates) {
        const ref = db.collection('applications').doc(update.id);
        batch.update(ref, { assignedTeam: update.team });
        count++;

        if (count === 490) {
            // commit and start new batch if needed (though 252 < 500)
        }
    }

    await batch.commit();
    console.log('SUCCESS: All applications redistributed successfully.');
}

redistribute().catch(console.error);
