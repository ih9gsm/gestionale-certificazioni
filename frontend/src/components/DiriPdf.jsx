import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 20, fontSize: 14, fontWeight: 'bold' },
  section: { marginBottom: 15, paddingBottom: 5, borderBottom: '1px solid #ccc' },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 150, fontWeight: 'bold' },
  value: { flex: 1 },
  title: { fontSize: 12, marginBottom: 5, fontFamily: 'Helvetica-Bold' }
});

export default function DiriPdf({ diri }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>DICHIARAZIONE DI RISPONDENZA DELL'IMPIANTO ALLA REGOLA DELL'ARTE</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>(Art. 7 comma 6 del D.M. 22 Gennaio 2008, n. 37)</Text>

        <View style={styles.section}>
          <Text style={styles.title}>1. PROFESSIONISTA / TECNICO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Ragione Sociale:</Text>
            <Text style={styles.value}>{diri.installer_company}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Titolare / Resp. Tecnico:</Text>
            <Text style={styles.value}>{diri.installer_resp || '---'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>2. DICHIARA SOTTO LA PROPRIA PERSONALE RESPONSABILITÀ</Text>
          <Text style={{ marginBottom: 5 }}>che l'impianto sotto descritto, realizzato presumibilmente nell'anno {diri.anno_realizzazione}, a seguito di sopralluoghi ed accertamenti, risulta rispondente alla regola dell'arte in base alle normative dell'epoca.</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Tipologia Impianto:</Text>
            <Text style={styles.value}>{diri.impianto_tipo ? diri.impianto_tipo.toUpperCase() : '---'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Descrizione Impianto:</Text>
            <Text style={styles.value}>{diri.descrizione_impianto}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Indirizzo:</Text>
            <Text style={styles.value}>{diri.indirizzo_impianto}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>3. COMMITTENTE / PROPRIETARIO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nome / Ragione Sociale:</Text>
            <Text style={styles.value}>{diri.client_name}</Text>
          </View>
        </View>

        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>Data: {new Date().toLocaleDateString()}</Text>
          </View>
          <View>
            <Text style={{ textAlign: 'center' }}>Firma del Tecnico</Text>
            <Text style={{ marginTop: 20 }}>___________________________</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
