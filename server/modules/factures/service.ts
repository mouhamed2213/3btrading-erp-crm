import { Facture } from "../../../generated/prisma/client";
import { factureRepository } from "./repository";
import { clientService } from "../clients/service";

export class FactureService {
  async getAllFactures(): Promise<Facture[]> {
    return factureRepository.findAll();
  }

  async getFactureById(id: string): Promise<Facture | null> {
    return factureRepository.findById(id);
  }

  async getFactureByNumero(numero: string): Promise<Facture | null> {
    return factureRepository.findByNumero(numero);
  }

  async getFacturesByClient(clientId: string): Promise<Facture[]> {
    return factureRepository.findByClientId(clientId);
  }

  async getUnpaidFactures(): Promise<Facture[]> {
    return factureRepository.findUnpaid();
  }

  async getPartiallyPaidFactures(): Promise<Facture[]> {
    return factureRepository.findPartiallyPaid();
  }

  async getPaidFactures(): Promise<Facture[]> {
    return factureRepository.findPaid();
  }

  async createFacture(data: {
    id: string;
    numero: string;
    clientId: string;
    type: "PROFORMA" | "ACOMPTE" | "DEFINITIVE";
    dateEmission: Date;
    dateEcheance?: Date;
    montantHT: number;
    tauxTVA?: number;
  }): Promise<Facture> {
    const tauxTVA = data.tauxTVA || 18;
    const montantTVA = (data.montantHT * tauxTVA) / 100;
    const montantTTC = data.montantHT + montantTVA;

    return factureRepository.create({
      id: data.id,
      numero: data.numero,
      client: { connect: { id: data.clientId } },
      type: data.type,
      dateEmission: data.dateEmission,
      dateEcheance: data.dateEcheance,
      montantHT: data.montantHT,
      tauxTVA,
      montantTVA,
      montantTTC,
      statut: "BROUILLON",
    } as any);
  }

  async updateFacture(id: string, data: Partial<any>): Promise<Facture> {
    return factureRepository.update(id, data as any);
  }

  async deleteFacture(id: string): Promise<void> {
    return factureRepository.delete(id);
  }

  async emitFacture(id: string): Promise<Facture> {
    return this.updateFacture(id, { statut: "EMISE" });
  }

  async recordPayment(
    id: string,
    montant: number,
    modePaiement: "CASH" | "MOBILE_MONEY"
  ): Promise<Facture> {
    const facture = await this.getFactureById(id);
    if (!facture) throw new Error("Facture not found");

    const newMontantPaye = parseFloat(facture.montantPaye.toString()) + montant;
    const montantTTC = parseFloat(facture.montantTTC.toString());

    let newStatut = facture.statut;
    if (newMontantPaye >= montantTTC) {
      newStatut = "PAYEE";
      // Ajouter le montant au solde du client
      await clientService.addSolde(facture.clientId, montant);
    } else if (newMontantPaye > 0) {
      newStatut = "PARTIELLEMENT_PAYEE";
    }

    return this.updateFacture(id, {
      montantPaye: newMontantPaye,
      modePaiement,
      statut: newStatut,
      datePaiement: newMontantPaye > 0 ? new Date() : null,
    });
  }

  async addReminder(id: string): Promise<Facture> {
    const facture = await this.getFactureById(id);
    if (!facture) throw new Error("Facture not found");

    return this.updateFacture(id, {
      nombreRelances: (facture.nombreRelances || 0) + 1,
      dateRelance: new Date(),
    });
  }

  async convertToDefinitive(id: string): Promise<Facture> {
    return this.updateFacture(id, { type: "DEFINITIVE" });
  }

  async calculateTotals(montantHT: number, tauxTVA: number = 18): Promise<{ montantTVA: number; montantTTC: number }> {
    const montantTVA = (montantHT * tauxTVA) / 100;
    const montantTTC = montantHT + montantTVA;
    return { montantTVA, montantTTC };
  }
}

export const factureService = new FactureService();
