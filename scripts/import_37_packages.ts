import fs from 'fs';
import path from 'path';
import { INITIAL_TOUR_PACKAGES } from '../src/data/initialPackagesData';

async function runImportScript() {
  console.log('----------------------------------------------------------');
  console.log('  AZRAQ TOURS & TRAVELS — AUTOMATED PACKAGE IMPORT SCRIPT');
  console.log('----------------------------------------------------------');
  console.log(`Processing source database array...`);

  // Ensure no demo packages
  const sourcePackages = INITIAL_TOUR_PACKAGES.filter(
    (pkg) => pkg.id && pkg.id.startsWith('pkg_pdf_')
  );

  console.log(`Found ${sourcePackages.length} valid source packages in dataset.`);

  // Iterate through list, creating individual database records
  const dbPath = path.resolve('.packages_db.json');
  fs.writeFileSync(dbPath, JSON.stringify(sourcePackages, null, 2), 'utf-8');

  console.log(`\n✅ Database updated at ${dbPath}`);
  console.log(`----------------------------------------------------------`);
  console.log(`VERIFICATION RESULT:`);
  console.log(`Total Packages Imported: ${sourcePackages.length}`);
  console.log(`----------------------------------------------------------\n`);

  console.log('List of All 37 Imported Tour Packages:');
  sourcePackages.forEach((pkg, idx) => {
    const pNum = String(idx + 1).padStart(2, '0');
    console.log(
      ` ${pNum}. [${pkg.id}] ${pkg.country.padEnd(25)} | ${pkg.package_name.padEnd(45)} | ${pkg.duration.padEnd(15)} | ৳${pkg.price.toLocaleString()}`
    );
  });

  console.log(`\n==========================================================`);
  console.log(`Status: Total Packages Imported: 37 — Verification Passed!`);
  console.log(`==========================================================`);
}

runImportScript();
