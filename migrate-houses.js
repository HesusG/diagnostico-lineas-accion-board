// Script de migración para asignar casas a estudiantes existentes
// Ejecuta este script en la consola del navegador (F12)

(function migrateToHouses() {
    console.log('🏠 Iniciando migración a sistema de casas...');

    // Obtener datos actuales
    const savedData = localStorage.getItem('participationBoard');

    if (!savedData) {
        console.log('❌ No hay datos guardados. Abre la aplicación y se asignarán automáticamente.');
        return;
    }

    let students = JSON.parse(savedData);

    // Verificar si ya tienen casas asignadas
    const hasHouses = students.some(s => s.house);

    if (hasHouses) {
        console.log('✅ Los estudiantes ya tienen casas asignadas:');
        const houseGroups = {
            fire: [],
            water: [],
            earth: [],
            air: []
        };

        students.forEach(s => {
            if (s.house) {
                houseGroups[s.house].push(s.name);
            }
        });

        console.log('\n🔥 Casa Fuego:', houseGroups.fire);
        console.log('💧 Casa Agua:', houseGroups.water);
        console.log('🌿 Casa Tierra:', houseGroups.earth);
        console.log('💨 Casa Aire:', houseGroups.air);

        return;
    }

    // Asignar casas (balanceado)
    const houses = ['fire', 'water', 'earth', 'air'];
    const houseIcons = {
        fire: '🔥',
        water: '💧',
        earth: '🌿',
        air: '💨'
    };
    const houseNames = {
        fire: 'Fuego',
        water: 'Agua',
        earth: 'Tierra',
        air: 'Aire'
    };

    // Mezclar estudiantes aleatoriamente
    students.sort(() => Math.random() - 0.5);

    // Asignar casa a cada estudiante
    students.forEach((student, index) => {
        student.house = houses[index % houses.length];
    });

    // Guardar cambios
    localStorage.setItem('participationBoard', JSON.stringify(students));

    console.log('✅ Migración completada! Casas asignadas:');

    const houseGroups = {
        fire: [],
        water: [],
        earth: [],
        air: []
    };

    students.forEach(s => {
        houseGroups[s.house].push(s.name);
    });

    console.log('\n🔥 Casa Fuego (Rojo):', houseGroups.fire);
    console.log('💧 Casa Agua (Azul):', houseGroups.water);
    console.log('🌿 Casa Tierra (Verde):', houseGroups.earth);
    console.log('💨 Casa Aire (Gris):', houseGroups.air);

    console.log('\n🔄 Recarga la página para ver los cambios!');
})();
