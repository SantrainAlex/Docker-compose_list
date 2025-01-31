import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, User } from './services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>Ajouter un utilisateur</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="userForm">
            <mat-form-field appearance="outline">
              <mat-label>Nom</mat-label>
              <input matInput formControlName="nom" placeholder="Entrez le nom">
              <mat-error *ngIf="userForm.get('nom')?.errors?.['required']">
                Le nom est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Prénom</mat-label>
              <input matInput formControlName="prenom" placeholder="Entrez le prénom">
              <mat-error *ngIf="userForm.get('prenom')?.errors?.['required']">
                Le prénom est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Âge</mat-label>
              <input matInput type="number" formControlName="age" placeholder="Entrez l'âge">
              <mat-error *ngIf="userForm.get('age')?.errors?.['required']">
                L'âge est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="Entrez l'email">
              <mat-error *ngIf="userForm.get('email')?.errors?.['required']">
                L'email est requis
              </mat-error>
              <mat-error *ngIf="userForm.get('email')?.errors?.['email']">
                Format d'email invalide
              </mat-error>
            </mat-form-field>

            <div class="button-row">
              <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!userForm.valid">
                Ajouter directement
              </button>
              <button mat-raised-button color="accent" (click)="ajouterALaListe()" [disabled]="!userForm.valid">
                Ajouter à la liste
              </button>
              <button mat-raised-button color="warn" (click)="sauvegarderTout()" [disabled]="tempUsers.length === 0">
                Sauvegarder la liste ({{tempUsers.length}})
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="tempUsers.length > 0" class="temp-users-card">
        <mat-card-header>
          <mat-card-title>Utilisateurs en attente ({{tempUsers.length}})</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="tempUsers" class="mat-elevation-z8">
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let user">{{user.nom}}</td>
            </ng-container>

            <ng-container matColumnDef="prenom">
              <th mat-header-cell *matHeaderCellDef>Prénom</th>
              <td mat-cell *matCellDef="let user">{{user.prenom}}</td>
            </ng-container>

            <ng-container matColumnDef="age">
              <th mat-header-cell *matHeaderCellDef>Âge</th>
              <td mat-cell *matCellDef="let user">{{user.age}}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{user.email}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user; let i = index">
                <button mat-icon-button color="warn" (click)="supprimerTemp(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumnsTemp"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumnsTemp;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <h1>Liste des Utilisateurs</h1>
      
      <table mat-table [dataSource]="users" class="mat-elevation-z8">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let user">{{user.id}}</td>
        </ng-container>

        <ng-container matColumnDef="nom">
          <th mat-header-cell *matHeaderCellDef>Nom</th>
          <td mat-cell *matCellDef="let user">{{user.nom}}</td>
        </ng-container>

        <ng-container matColumnDef="prenom">
          <th mat-header-cell *matHeaderCellDef>Prénom</th>
          <td mat-cell *matCellDef="let user">{{user.prenom}}</td>
        </ng-container>

        <ng-container matColumnDef="age">
          <th mat-header-cell *matHeaderCellDef>Âge</th>
          <td mat-cell *matCellDef="let user">{{user.age}}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let user">{{user.email}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let user">
            <button mat-icon-button color="warn" (click)="deleteUser(user.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .form-card {
      margin-bottom: 20px;
    }

    .temp-users-card {
      margin-bottom: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .button-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    h1 {
      color: #333;
      margin: 20px 0;
    }
    
    table {
      width: 100%;
    }
    
    .mat-column-actions {
      width: 80px;
      text-align: center;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class AppComponent implements OnInit {
  users: User[] = [];
  tempUsers: User[] = [];
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'age', 'email', 'actions'];
  displayedColumnsTemp: string[] = ['nom', 'prenom', 'age', 'email', 'actions'];
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.loadUsers();
          this.userForm.reset();
          this.snackBar.open('Utilisateur ajouté avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
          this.snackBar.open('Erreur lors de l\'ajout de l\'utilisateur', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  ajouterALaListe() {
    if (this.userForm.valid) {
      const newUser = this.userForm.value;
      
      // Vérifier si l'email existe déjà dans la liste temporaire
      if (this.tempUsers.some(user => user.email === newUser.email)) {
        this.snackBar.open('Cet email existe déjà dans la liste', 'Fermer', {
          duration: 3000
        });
        return;
      }

      this.tempUsers.push(newUser);
      this.userForm.reset();
      this.snackBar.open('Utilisateur ajouté à la liste', 'Fermer', {
        duration: 3000
      });
    }
  }

  supprimerTemp(index: number) {
    this.tempUsers.splice(index, 1);
    this.snackBar.open('Utilisateur retiré de la liste', 'Fermer', {
      duration: 3000
    });
  }

  sauvegarderTout() {
    if (this.tempUsers.length > 0) {
      this.userService.createUsers(this.tempUsers).subscribe({
        next: () => {
          this.loadUsers();
          this.tempUsers = [];
          this.snackBar.open('Utilisateurs sauvegardés avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
          this.snackBar.open('Erreur lors de la sauvegarde des utilisateurs', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
        this.snackBar.open('Utilisateur supprimé avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
          duration: 3000
        });
      }
    });
  }
}
